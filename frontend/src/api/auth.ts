import { apiFetch } from "./client";

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

export const loginUser = (credentials: LoginPayload) => {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
};

export const registerUser = (payload: RegisterPayload) => {
  return apiFetch<any>("/auth/register", {
    method: "POST",
    body: payload,
  });
};
