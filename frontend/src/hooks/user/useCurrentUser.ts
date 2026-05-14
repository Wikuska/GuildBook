import { useQuery } from "@tanstack/react-query";
import { fetchFeedProfile } from "../../api/settings";
import { useAuthStore } from "../../store/authStore";

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["users", "current"],
    queryFn: fetchFeedProfile,
    enabled: isAuthenticated,
  });
}
