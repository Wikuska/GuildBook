import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/posts";
import { useLocation } from "react-router-dom";

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const endpoint = pathname.slice(1);

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previous = queryClient.getQueryData([endpoint]);

      queryClient.setQueryData([endpoint], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) =>
          page.filter((p: any) => p.id !== postId),
        ),
      }));

      return { previous };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData([endpoint], context?.previous);
    },
  });
};
