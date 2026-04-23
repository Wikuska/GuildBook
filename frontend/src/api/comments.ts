import { apiFetch } from "./client";
import type { AuthorResponse } from "./posts";

interface CommentResponse {
  id: number;
  content: string;
  author: AuthorResponse;
  post_id: number;
  created_at: string;
}

export const fetchComments = (postId: number) => {
  return apiFetch<CommentResponse[]>(`/posts/${postId}/comments`);
};

export const createComment = (postId: number, content: string) => {
  return apiFetch<CommentResponse>(`/posts/${postId}/comments`, {
    method: "POST",
    body: { content },
  });
};
