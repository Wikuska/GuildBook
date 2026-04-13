import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "../api/lookup"

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: Infinity,
  })
}