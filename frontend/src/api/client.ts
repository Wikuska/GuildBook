export const API_URL = "http://127.0.0.1:8000";

interface ApiOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, ...customConfig } = options;
  
  const headers = {
    "Content-Type": "application/json",
    ...customConfig.headers,
  };

  const config: RequestInit = {
    ...customConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(`${API_URL}${path}`, config);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.detail || `HTTP Error: ${res.status}`;
    throw new Error(errorMessage);
  }

  if (res.status === 204) return {} as T;

  return await res.json();
}