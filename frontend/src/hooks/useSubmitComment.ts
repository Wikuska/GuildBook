import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createComment } from "../api/comments";

export function useSubmitComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}
