import { usePosts } from "../../hooks/usePosts";
import { PostCard } from "./PostCard";
import { useModalStore } from "../../store/useModalStore";

interface PostFeedProps {
  endpoint: string;
  title: string;
}

export function PostFeed({ endpoint, title }: PostFeedProps) {
  profileView?: boolean;
}

export function PostFeed({ endpoint, title, profileView }: PostFeedProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePosts(endpoint);

  const posts = data?.pages.flat() ?? [];
  const openCreatePostModal = useModalStore((state) => state.openCreatePost);
    queryKey,
  } = usePosts(endpoint);

  const posts = data?.pages.flat() ?? [];

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center text-text-dim text-xs tracking-widest uppercase">
        Gathering scrolls...
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-1 items-center justify-center text-text-dim text-xs tracking-widest uppercase">
        Failed to read the scrolls.
      </div>
    );

  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-text-dim before:h-1 before:w-1 before:shrink-0 before:rotate-45 before:bg-gold">
          {title}
        </div>
        {!profileView && (
          <button
            onClick={openCreatePostModal}
            className="relative rounded border border-gold bg-bg-surface px-3 py-1.5 text-[11px] uppercase tracking-[1px]
             text-gold transition-colors hover:bg-bg-mid"
          >
          <button className="relative rounded border border-gold bg-bg-surface px-3 py-1.5 text-[11px] uppercase tracking-[1px] text-gold transition-colors hover:bg-bg-mid">
            + New post
          </button>
        )}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-text-dim text-xs tracking-widest uppercase">
          No scrolls found.
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
        <PostCard key={post.id} post={post} queryKey={queryKey} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-2 w-full rounded border border-border-accent bg-bg-surface py-2 text-[11px] uppercase tracking-widest text-text-mid transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
        >
          {isFetchingNextPage ? "Gathering more..." : "Load more"}
        </button>
      )}
    </div>
  );
}
