import { create } from "zustand"

interface FilterStore {
  selectedTag: string | null
  setSelectedTag: (tag: string | null) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}))