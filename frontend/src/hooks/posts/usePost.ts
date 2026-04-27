import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../../api/posts";

export function usePost(postId: number | null) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId!),
    enabled: postId !== null,
  });
}
