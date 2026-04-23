import { create } from "zustand";
import type { PostResponse } from "../api/posts";

interface PostFormStore {
  isCreatePostOpen: boolean;
  editingPost: PostResponse | null;
  openCreatePost: () => void;
  openEditPost: (post: PostResponse) => void;
  closeCreatePost: () => void;
}

export const usePostFormStore = create<PostFormStore>((set) => ({
  isCreatePostOpen: false,
  editingPost: null,
  openCreatePost: () => set({ isCreatePostOpen: true, editingPost: null }),
  openEditPost: (post) => set({ isCreatePostOpen: true, editingPost: post }),
  closeCreatePost: () => set({ isCreatePostOpen: false, editingPost: null }),
}));
