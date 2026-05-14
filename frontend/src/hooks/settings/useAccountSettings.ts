import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEmail, changePassword } from "../../api/settings";

export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "current"],
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
