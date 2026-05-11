import { useEffect, useRef } from "react";

export interface SseNewPostEvent {
  category: string;
  author_id: number;
}

export interface SseNotificationEvent {
  action: string;
  post_id?: number;
  actor_name: string;
  actor_id?: number;
  comment_id?: number;
}

export interface SseNewMessageEvent {
  conversation_id: number;
  sender_name: string;
  snippet: string;
}

interface UseEventStreamProps {
  token: string | null;
  onNewPost?: (event: SseNewPostEvent) => void;
  onNewMessage?: (event: SseNewMessageEvent) => void;
  onNotification?: (event: SseNotificationEvent) => void;
}

export function useLiveEvents({
  token,
  onNewPost,
  onNewMessage,
  onNotification,
}: UseEventStreamProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!token) return;

    const sseUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/notifications/stream?token=${token}`;

    eventSourceRef.current = new EventSource(sseUrl);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        const { type, data } = parsedData;

        switch (type) {
          case "new_post":
            onNewPost?.(data);
            break;

          case "new_message":
            onNewMessage?.(data);
            break;

          case "notification":
            onNotification?.(data);
            break;

          default:
            console.warn("Unknown notification type SSE:", type);
        }
      } catch (err) {
        console.error("Error parsing data from SSE:", err);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("🔴 Error connecting to SSE", error);
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [token, onNewPost, onNewMessage, onNotification]);
}
