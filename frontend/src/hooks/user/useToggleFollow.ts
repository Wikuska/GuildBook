import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowUser } from "../../api/users";

interface ToggleFollowVariables {
  userId: string | number;
  isFollowing: boolean;
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isFollowing }: ToggleFollowVariables) =>
      toggleFollowUser(String(userId), isFollowing),

    onMutate: async ({ userId, isFollowing }) => {
      const profileQueryKey = ["users", "profile", String(userId)];

      await queryClient.cancelQueries({ queryKey: profileQueryKey });
      const previousProfile = queryClient.getQueryData(profileQueryKey);

      queryClient.setQueryData(profileQueryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          is_followed_by_current_user: !isFollowing,
          followers_count: isFollowing
            ? Math.max(0, old.followers_count - 1)
            : old.followers_count + 1,
        };
      });
      return { previousProfile, profileQueryKey };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousProfile && context.profileQueryKey) {
        queryClient.setQueryData(
          context.profileQueryKey,
          context.previousProfile,
        );
      }
    },

    onSettled: (_data, _error, _vars, context) => {
      if (context?.profileQueryKey) {
        queryClient.invalidateQueries({ queryKey: context.profileQueryKey });
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
}
