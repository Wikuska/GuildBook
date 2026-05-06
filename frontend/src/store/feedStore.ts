import { create } from "zustand";
import type { FeedSection } from "../utils";

interface FeedState {
  newPostsFlags: Record<FeedSection, boolean>;
  setNewPostsFlag: (section: FeedSection, hasNew: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  newPostsFlags: {
    feed: false,
    market: false,
    help: false,
    contracts: false,
  },
  setNewPostsFlag: (section, hasNew) =>
    set((state) => ({
      newPostsFlags: {
        ...state.newPostsFlags,
        [section]: hasNew,
      },
    })),
}));
