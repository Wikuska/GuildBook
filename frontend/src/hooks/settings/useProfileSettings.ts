import {
  fetchProfileSettings,
  updateProfileSettings,
} from "../../api/settings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProfileSettings() {
  return useQuery({
    queryKey: ["users", "current", "settings"],
    queryFn: fetchProfileSettings,
  });
}

export function useUpdateProfileSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "current"],
      });
    },
  });
}
