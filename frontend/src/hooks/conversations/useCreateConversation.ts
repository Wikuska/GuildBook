import { useQueryClient, useMutation } from "@tanstack/react-query";
import { openConversation } from "../../api/conversations";
import { useChatStore } from "../../store/useChatStore";

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const openConversationWindow = useChatStore(
    (state) => state.openConversation,
  );

  return useMutation({
    mutationFn: (otherUserId: number) => openConversation(otherUserId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data && data.id) {
        openConversationWindow(data.id);
      }
    },
  });
}
