import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/posts";
import type { UpdatePostFormValues } from "../validations/post";
import { useLocation } from "react-router-dom";

export const useUpdatePost = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const endpoint = pathname.slice(1);

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: UpdatePostFormValues;
    }) => updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      onSuccess();
    },
  });
};
