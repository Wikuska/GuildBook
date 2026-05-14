import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEmail, changePassword } from "../../api/settings";
import { toast } from "sonner";

export function useChangeEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeEmail,
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", "current"],
      });
      toast.success("Email updated", {
        description: "Your new email has been recorded in the scrolls.",
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    meta: { silent: true },
    onSuccess: () => {
      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });
    },
  });
}
