import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/posts";
import type { CreatePostFormValues } from "../validations/post";
import { toExcludedRaces } from "../utils";
import { useLocation } from "react-router-dom";

export const useCreatePost = (allRaceIds: number[], onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const endpoint = pathname.slice(1);

  return useMutation({
    mutationFn: (data: CreatePostFormValues) =>
      createPost({
        ...data,
        visible_race_ids: toExcludedRaces(data.visible_race_ids, allRaceIds),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      onSuccess();
    },
  });
};
