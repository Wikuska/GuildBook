import { apiFetch } from "./client";
import type { RaceResponse, TagResponse } from "./lookup";

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    race: RaceResponse;
    avatar_url: string | null;
  };
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  tags: TagResponse[];
  likes_count: number;
  comments_count: number;
  is_liked_by_current_user: boolean;
  is_followed_author: boolean;
}

interface FetchPostsParams {
  endpoint: string;
  skip?: number;
  limit?: number;
  tag_ids?: number[];
}

export const fetchPosts = ({
  endpoint,
  skip,
  limit,
  tag_ids,
}: FetchPostsParams) => {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));
  tag_ids?.forEach((id) => params.append("tag_ids", String(id)));

  return apiFetch<PostResponse[]>(`/${endpoint}?${params.toString()}`);
};

export async function toggleLikePost(postId: number, isLiked: boolean) {
  return apiFetch<void>(`/posts/${postId}/like`, {
    method: isLiked ? "DELETE" : "POST",
  });
}
