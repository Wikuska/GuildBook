import { apiFetch } from "./client";
import { type RaceResponse } from "./lookup";

export interface PublicUserResponse {
  id: string;
  username: string;
  race: RaceResponse;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_followed_by_current_user: boolean;
  created_at: string;
}

export interface UserSearchResult {
  id: number;
  username: string;
  race: { id: number; name: string };
  is_followed: boolean;
}

interface FetchUserProfileParams {
  id: string;
}

export const fetchUserProfile = ({ id }: FetchUserProfileParams) => {
  return apiFetch<PublicUserResponse>(`/users/${id}`);
};

export function toggleFollowUser(userId: string, isFollowing: boolean) {
  return apiFetch<void>(`/users/${userId}/follow`, {
    method: isFollowing ? "DELETE" : "POST",
  });
}

export const searchUsers = (query: string) => {
  return apiFetch<UserSearchResult[]>(`/users/search?q=${query}`);
};
