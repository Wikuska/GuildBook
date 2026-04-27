import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../api/posts";
import { useFilterStore } from "../../store/FilterStore";

const LIMIT = 10;

export function usePosts(endpoint: string) {
  const selectedTag = useFilterStore((s) => s.selectedTag);
  const boardName = endpoint.split("/").pop();
  const queryKey = ["posts", boardName, selectedTag?.id ?? null];

  return {
    queryKey,
    ...useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 0 }) =>
        fetchPosts({
          endpoint,
          skip: pageParam,
          limit: LIMIT,
          tag_ids: selectedTag ? [selectedTag.id] : undefined,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < LIMIT) return undefined;
        return allPages.length * LIMIT;
      },
      initialPageParam: 0,
    }),
  };
}
