import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../../api/conversations";

export function useConversations(enabled: boolean) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    enabled,
  });
}
