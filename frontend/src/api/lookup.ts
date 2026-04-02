import { apiFetch } from './client';

export interface RaceResponse {
  id: number;
  name: string;
}

export const getRaces = () => {
  return apiFetch<RaceResponse[]>('/lookup/races');
};