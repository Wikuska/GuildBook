import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../../api/conversations";

export function useMessages(conversationId: number | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: conversationId !== null,
    refetchInterval: 3_000,
  });
}
