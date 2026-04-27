import { apiFetch } from "./client";
import type { RaceResponse, TagResponse } from "./lookup";
import type { CreatePostFormValues } from "../validations/post";
import type { UpdatePostFormValues } from "../validations/post";

export interface AuthorResponse {
  id: number;
  username: string;
  race: RaceResponse;
  avatar_url: string | null;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  author: AuthorResponse;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  tags: TagResponse[];
  visible_races: RaceResponse[];
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

export const fetchPost = (postId: number) => {
  return apiFetch<PostResponse>(`/posts/${postId}`);
};

export async function toggleLikePost(postId: number, isLiked: boolean) {
  return apiFetch<void>(`/posts/${postId}/like`, {
    method: isLiked ? "DELETE" : "POST",
  });
}

export const createPost = (data: CreatePostFormValues) => {
  return apiFetch<PostResponse>("/posts", {
    method: "POST",
    body: data,
  });
};

export const deletePost = (postId: number) => {
  return apiFetch(`/posts/${postId}`, {
    method: "DELETE",
  });
};

export const updatePost = (postId: number, data: UpdatePostFormValues) => {
  return apiFetch<PostResponse>(`/posts/${postId}`, {
    method: "PUT",
    body: data,
  });
};
