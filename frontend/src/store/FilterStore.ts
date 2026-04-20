import { create } from "zustand";
import type { TagResponse } from "../api/lookup";

interface FilterStore {
  selectedTag: TagResponse | null;
  setSelectedTag: (tag: TagResponse | null) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
