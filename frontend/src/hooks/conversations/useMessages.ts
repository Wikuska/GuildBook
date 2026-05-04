import { useEffect, useRef, useState } from "react";
import { fetchMessages } from "../../api/conversations";
import type { MessageResponse } from "../../api/conversations";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

export function useMessages(conversationId: number | null) {
  const token = useAuthStore((s) => s.token);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (conversationId === null || !token) return;

    let isSubscribed = true;
    let ws: WebSocket | null = null;

    const initializeChat = async () => {
      try {
        const history = await fetchMessages(conversationId);
        if (!isSubscribed) return;
        setMessages(history);

        ws = new WebSocket(
          `ws://localhost:8000/conversations/${conversationId}/ws`,
        );
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          ws?.send(JSON.stringify({ token: token }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "read_receipt") {
            setMessages((prev) =>
              prev.map((m) =>
                m.receiver_id === data.read_by ? { ...m, is_read: true } : m,
              ),
            );
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;
            return [...prev, data];
          });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        };

        ws.onclose = () => setConnected(false);
      } catch (error) {
        console.error("Błąd ładowania wiadomości:", error);
      }
    };

    initializeChat();

    return () => {
      isSubscribed = false;
      if (ws) {
        ws.close();
      }
      wsRef.current = null;
      setMessages([]);
      setConnected(false);
    };
  }, [conversationId, token, queryClient]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
    }
  };

  return { messages, connected, sendMessage };
}
