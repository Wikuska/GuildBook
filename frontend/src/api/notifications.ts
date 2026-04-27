import { apiFetch } from "./client";
import type { AuthorResponse } from "./posts";

export interface NotificationResponse {
  id: number;
  actor: AuthorResponse;
  type: "post_like" | "post_comment" | "follow";
  post_id: number | null;
  is_read: boolean;
  created_at: string;
}

interface UnreadCountResponse {
  unread_count: number;
}

export const fetchNotifications = () =>
  apiFetch<NotificationResponse[]>("/notifications");

export const fetchUnreadCount = () =>
  apiFetch<UnreadCountResponse>("/notifications/unread-count");

export const markOneRead = (notificationId: number) =>
  apiFetch<NotificationResponse>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });

export const markAllRead = () =>
  apiFetch("/notifications/read", { method: "PATCH" });
