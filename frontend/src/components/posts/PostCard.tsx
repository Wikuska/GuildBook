import { useToggleLike } from "../../hooks/likes";
import { type PostResponse } from "../../api/posts";
import { Avatar } from "../ui/Avatar";
import { formatTime } from "../../utils";
import { Link } from "react-router-dom";
import type { QueryKey } from "@tanstack/query-core";
import { useCurrentUser } from "../../hooks/user";
import { Swords, Feather } from "lucide-react";
import { useDeletePost } from "../../hooks/posts";
import { useState } from "react";
import { usePostFormStore } from "../../store/usePostFormStore";
import { usePostViewStore } from "../../store/usePostViewStore";

interface PostCardProps {
  post: PostResponse;
  queryKey: QueryKey;
}

export function PostCard({ post, queryKey }: PostCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: toggleLike } = useToggleLike(
    post.id,
    post.is_liked_by_current_user,
    queryKey,
  );

  const deletePostMutation = useDeletePost(queryKey);
  const openEditModal = usePostFormStore((state) => state.openEditPost);
  const openViewModal = usePostViewStore((state) => state.openPost);

  const { data: user } = useCurrentUser();
  const isAuthor = user?.id === post.author.id;

  return (
    <article
      onMouseLeave={() => setConfirmDelete(false)}
      onClick={() => openViewModal(post.id, queryKey)}
      className={`group relative cursor-pointer rounded bg-bg-mid p-4 transition-colors hover:border-border-accent
        before:absolute before:-left-px before:-top-px before:h-2 before:w-2 before:rounded-tl-[1px] before:border-l before:border-t
        after:absolute after:-bottom-px after:-right-px after:h-2 after:w-2 after:rounded-br-[1px] after:border-b after:border-r
        ${
          post.is_followed_author
            ? "border-y border-r border-border-accent border-l-2 border-l-gold pl-3.75 before:border-gold after:border-gold"
            : "border border-border-base before:border-border-accent after:border-border-accent"
        }
      `}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <Link
          to={`/profile/${post.author.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          <Avatar
            username={post.author.username}
            avatarUrl={post.author.avatar_url}
            raceName={post.author.race.name}
            size="sm"
          />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-parchment hover:text-gold transition-colors">
              {post.author.username}
              {post.is_followed_author && (
                <span className="rounded-[3px] border border-border-accent bg-bg-surface px-1.5 py-px text-[10px] tracking-[0.5px] text-sage">
                  following
                </span>
              )}
            </div>
            <div className="text-[11px] text-text-dim">
              {post.author.race.name}
            </div>
          </div>
        </Link>

        {/* Zmiana tutaj: dodane ml-auto */}
        <span className="ml-auto text-[11px] text-text-dim">
          {formatTime(post.created_at)}
        </span>

        {isAuthor && (
          <div
            className="hidden group-hover:flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => openEditModal(post)}
              className="text-text-dim hover:text-gold transition-colors"
            >
              <Feather className="w-3.5 h-3.5" />
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Deleting post with ID:", post.id);
                    deletePostMutation.mutate(post.id);
                  }}
                  className="text-[10px] uppercase tracking-[1px] text-red-400 hover:text-red-300 transition-colors"
                >
                  confirm
                </button>
                <span className="text-border-accent">·</span>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-[10px] uppercase tracking-[1px] text-text-dim hover:text-text-mid transition-colors"
                >
                  cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-text-dim hover:text-red-400 transition-colors"
              >
                <Swords className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="my-3 flex flex-col gap-1.5">
        <h3 className="text-base font-semibold tracking-wide text-parchment sm:text-lg">
          {post.title}
        </h3>
        <p className="text-[13px] leading-[1.6] text-text-mid line-clamp-4">
          {post.content}
        </p>
      </div>
      <div className="relative mb-2 h-px bg-border-base after:absolute after:-top-0.75 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rotate-45 after:bg-border-accent" />
      <div className="flex items-center">
        <div className="flex flex-1 flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-[3px] border border-border-accent bg-bg-surface px-1.75 py-0.5 text-[10px] tracking-[0.5px] text-text-mid"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className="group/btn flex items-center gap-1.5 text-xs transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12s-5-3.5-5-7a3 3 0 0 1 5-2.24A3 3 0 0 1 12 5c0 3.5-5 7-5 7z"
                stroke={post.is_liked_by_current_user ? "#c9a84c" : "#3d3428"}
                fill={post.is_liked_by_current_user ? "#c9a84c" : "none"}
                className="transition-colors group-hover/btn:stroke-muted"
              />
            </svg>
            <span
              className={
                post.is_liked_by_current_user
                  ? "text-gold"
                  : "text-text-dim group-hover/btn:text-muted"
              }
            >
              {post.likes_count}
            </span>
          </button>
          <button className="group/btn flex items-center gap-1.5 text-xs text-text-dim transition-colors hover:text-muted">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2h10v8H8l-3 2v-2H2z"
                stroke="#3d3428"
                strokeWidth="1"
                fill="none"
                className="transition-colors group-hover/btn:stroke-muted"
                onClick={() => openViewModal(post.id, queryKey)}
              />
            </svg>
            <span>{post.comments_count}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
