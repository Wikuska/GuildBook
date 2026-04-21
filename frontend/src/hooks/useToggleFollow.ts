import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowUser } from "../api/users";

export function useToggleFollow(userId: string, isFollowing: boolean) {
  const queryClient = useQueryClient();

  const queryKey = ["profile", String(userId)];

  return useMutation({
    mutationFn: () => toggleFollowUser(userId, isFollowing),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousProfile = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          is_followed_by_current_user: !old.is_followed_by_current_user,
          followers_count: old.is_followed_by_current_user
            ? old.followers_count - 1
            : old.followers_count + 1,
        };
      });

      return { previousProfile };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
