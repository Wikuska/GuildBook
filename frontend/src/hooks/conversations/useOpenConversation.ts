import { useQueryClient, useMutation } from "@tanstack/react-query";
import { openConversation } from "../../api/conversations";

export function useOpenConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (otherUserId: number) => openConversation(otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
