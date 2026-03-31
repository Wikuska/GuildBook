import { useAuthStore } from '../store/authStore';

export const API_URL = "http://127.0.0.1:8000";

interface ApiOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, ...customConfig } = options;

  const token = useAuthStore.getState().token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customConfig.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${API_URL}${path}`, config);

  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/auth';
    return Promise.reject(new Error('Session expired'));
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error: ${res.status}`);
  }

  if (res.status === 204) return {} as T;

  return await res.json();
}