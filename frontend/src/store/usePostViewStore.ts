import { create } from "zustand";
import { type QueryKey } from "@tanstack/react-query";

interface PostViewStore {
  openPostId: number | null;
  feedQueryKey: QueryKey | null;
  openPost: (id: number, queryKey: QueryKey | null) => void;
  closePost: () => void;
}

export const usePostViewStore = create<PostViewStore>((set) => ({
  openPostId: null,
  feedQueryKey: null,
  openPost: (id, queryKey) => set({ openPostId: id, feedQueryKey: queryKey }),
  closePost: () => set({ openPostId: null, feedQueryKey: null }),
}));
