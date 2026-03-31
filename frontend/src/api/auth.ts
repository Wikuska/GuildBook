import { apiFetch } from './client';

export const loginUser = (credentials: Record<string, string>) => {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: {
      email: credentials.email,
      password: credentials.password
    }
  });
};

export const registerUser = (payload: any) => {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: payload
  });
};