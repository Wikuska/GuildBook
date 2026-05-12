import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchUsers } from "../../api/users";

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["user-search", query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
