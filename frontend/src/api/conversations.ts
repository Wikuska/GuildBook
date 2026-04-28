import { apiFetch } from "./client";
import type { AuthorResponse } from "./posts";

export interface MessagePreviewResponse {
  id: number;
  content: string;
  sender_id: number;
  is_read: boolean;
  created_at: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  is_read: boolean;
  created_at: string;
}

export interface ConversationResponse {
  id: number;
  other_participant: AuthorResponse;
  last_message: MessagePreviewResponse | null;
  unread_count: number;
  created_at: string;
}

export const fetchConversations = () =>
  apiFetch<ConversationResponse[]>("/conversations");

export const fetchMessages = (conversationId: number) =>
  apiFetch<MessageResponse[]>(`/conversations/${conversationId}/messages`);

export const fetchUnreadMessagesCount = () =>
  apiFetch<{ unread_count: number }>("/conversations/unread-count");

export const openConversation = (otherUserId: number) =>
  apiFetch<ConversationResponse>(`/conversations/${otherUserId}/open`, {
    method: "POST",
  });

export const sendMessage = (conversationId: number, content: string) =>
  apiFetch<MessageResponse>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: { content },
  });

export const markConversationRead = (conversationId: number) =>
  apiFetch(`/conversations/${conversationId}/read`, {
    method: "PATCH",
  });
