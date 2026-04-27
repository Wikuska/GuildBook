import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../../api/notifications";

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled,
  });
}
