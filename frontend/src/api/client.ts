import { useAuthStore } from '../store/authStore';

export const API_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface ApiOptions extends RequestInit {
  body?: any;
}

function parseErrorMessage(errorData: any): string {
  if (!errorData.detail) return 'Something went wrong';
  
  if (Array.isArray(errorData.detail)) {
    return errorData.detail
      .map((e: any) => `${e.loc.at(-1)}: ${e.msg}`)
      .join(', ');
  }
  
  return errorData.detail;
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
    const isAuthRoute = path.startsWith('/auth');
    
    if (!isAuthRoute) {
      useAuthStore.getState().logout();
      window.location.href = '/auth';
      return Promise.reject(new Error('Session expired'));
    }
    
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, parseErrorMessage(errorData));
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(res.status, parseErrorMessage(errorData));
  }

  if (res.status === 204) return {} as T;

  return await res.json();
}