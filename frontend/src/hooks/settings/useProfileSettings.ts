import {
  fetchProfileSettings,
  updateProfileSettings,
} from "../../api/settings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Profile saved", {
        description: "The chronicle has been updated.",
      });
    },
  });
}
