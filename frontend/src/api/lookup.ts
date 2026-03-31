import { apiFetch } from './client';

export interface Race {
  id: number;
  name: string;
}

export const getRaces = () => {
  return apiFetch<Race[]>('/lookup/races');
};