import { create } from "zustand";
import type { PostResponse } from "../api/posts";

interface ModalStore {
  isCreatePostOpen: boolean;
  editingPost: PostResponse | null;
  openCreatePost: () => void;
  openEditPost: (post: PostResponse) => void;
  closeCreatePost: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isCreatePostOpen: false,
  editingPost: null,
  openCreatePost: () => set({ isCreatePostOpen: true, editingPost: null }),
  openEditPost: (post) => set({ isCreatePostOpen: true, editingPost: post }),
  closeCreatePost: () => set({ isCreatePostOpen: false, editingPost: null }),
}));
