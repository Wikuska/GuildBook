import { apiFetch } from './client';
import { type RaceResponse } from './lookup';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  race_id: number;
}

interface FeedProfileResponse {
    id: number;
    username: string;
    race: RaceResponse;
    avatar_url: string | null;
    followers_count: number;
    following_count: number
}

export const loginUser = (credentials: LoginPayload) => {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials
  });
};

export const registerUser = (payload: RegisterPayload) => {
  return apiFetch<any>('/auth/register', {
    method: 'POST',
    body: payload
  });
};

export const fetchFeedProfile = () => {
  return apiFetch<FeedProfileResponse>('auth/me/feed-profile', {
    method: 'GET'
  })
}
