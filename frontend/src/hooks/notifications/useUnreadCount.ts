import { useQuery } from "@tanstack/react-query";
import { fetchUnreadCount } from "../../api/notifications";

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 30_000,
  });
}
