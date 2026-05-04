import { useQueryClient, useMutation } from "@tanstack/react-query";
import { markConversationRead } from "../../api/conversations";

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) =>
      markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversations", "unread-count"],
      });
    },
  });
}
