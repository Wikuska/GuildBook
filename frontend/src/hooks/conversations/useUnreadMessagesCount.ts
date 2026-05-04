import { useQuery } from "@tanstack/react-query";
import { fetchUnreadMessagesCount } from "../../api/conversations";

export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ["conversations", "unread-count"],
    queryFn: fetchUnreadMessagesCount,
    refetchInterval: 30_000,
  });
}
