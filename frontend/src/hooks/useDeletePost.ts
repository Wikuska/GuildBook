import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { deletePost } from "../api/posts";

export const useDeletePost = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) =>
          page.filter((p: any) => p.id !== postId),
        ),
      }));

      return { previous };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
