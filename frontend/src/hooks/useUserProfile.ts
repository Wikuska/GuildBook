import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/users";
import type { PublicUserResponse } from "../api/users";

export function useUserProfile(id: string | undefined) {
  return useQuery<PublicUserResponse>({
    queryKey: ["users", "profile", String(id)],
    queryFn: () => fetchUserProfile({ id: id! }),
    enabled: !!id,
  });
}
