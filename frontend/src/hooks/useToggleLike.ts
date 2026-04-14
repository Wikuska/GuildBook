import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleLikePost } from "../api/posts"
import { useFilterStore } from "../store/filterStore"

export function useToggleLike(postId: number, isLiked: boolean) {
  const queryClient = useQueryClient()
  const selectedTag = useFilterStore(s => s.selectedTag)
  const queryKey = ["feed", selectedTag?.id ?? null]

  return useMutation({
    mutationFn: () => toggleLikePost(postId, isLiked),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        pages: old.pages.map((page: any[]) =>
          page.map(post =>
            post.id === postId
              ? {
                  ...post,
                  is_liked_by_current_user: !post.is_liked_by_current_user,
                  likes_count: post.is_liked_by_current_user
                    ? post.likes_count - 1
                    : post.likes_count + 1,
                }
              : post
          )
        ),
      }))

      return { previous }
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}