import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/posts";
import type { CreatePostFormValues } from "../validations/post";

export const useCreatePost = (onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostFormValues) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess();
    },
  });
};
