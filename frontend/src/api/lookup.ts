import { apiFetch } from "./client";

export interface RaceResponse {
  id: number;
  name: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export const fetchRaces = () => {
  return apiFetch<RaceResponse[]>("/lookup/races");
};

export const fetchTags = () => {
  return apiFetch<TagResponse[]>("/lookup/tags");
};

export const fetchCategories = () => {
  return apiFetch<CategoryResponse[]>("/lookup/categories");
};
