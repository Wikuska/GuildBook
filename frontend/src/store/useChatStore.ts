import { create } from "zustand";

interface ChatStore {
  openConversationIds: number[];
  openConversation: (id: number) => void;
  closeConversation: (id: number) => void;
}

const MAX_OPEN_CONVERSATIONS = 3;

export const useChatStore = create<ChatStore>((set) => ({
  openConversationIds: [],
  openConversation: (id) =>
    set((state) => {
      if (state.openConversationIds.includes(id)) return state;
      const updated = [id, ...state.openConversationIds];
      return {
        openConversationIds: updated.slice(0, MAX_OPEN_CONVERSATIONS),
      };
    }),
  closeConversation: (id) =>
    set((state) => ({
      openConversationIds: state.openConversationIds.filter((c) => c !== id),
    })),
}));
