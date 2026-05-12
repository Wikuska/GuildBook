import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { usePost } from "../../hooks/posts";
import { useComments, useSubmitComment } from "../../hooks/comments";
import { useToggleLike } from "../../hooks/likes";
import { Avatar } from "../ui/Avatar";
import { formatTime } from "../../utils";
import { useModalOverlay } from "../../hooks/ui/useModalOverlay";
import { PostComment } from "../posts/PostComment";
import { useCurrentUser } from "../../hooks/user";

export function PostViewModal() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  const openPostId = Number(id);
  if (isNaN(openPostId)) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const feedQueryKey = location.state?.feedQueryKey;

  const { data: user } = useCurrentUser();
  const [commentText, setCommentText] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: post, isLoading: postLoading } = usePost(openPostId);
  const { data: comments = [], isLoading: commentsLoading } =
    useComments(openPostId);
  const { mutate: submitComment, isPending: isSubmitting } = useSubmitComment(
    openPostId!,
  );

  const { mutate: toggleLike } = useToggleLike(
    post?.id ?? 0,
    post?.is_liked_by_current_user ?? false,
    feedQueryKey ?? ["post", openPostId],
  );

  const handleClose = () => {
    if (!location.state?.background) {
      navigate("/feed");
    } else {
      navigate(-1);
    }
  };

  useModalOverlay(true, handleClose);

  useEffect(() => {
    if (openPostId === null) setCommentText("");
  }, [openPostId]);

  if (openPostId === null) return null;

  const handleSubmit = () => {
    const trimmed = commentText.trim();
    if (!trimmed || isSubmitting) return;
    submitComment(trimmed, {
      onSuccess: () => {
        (setCommentText(""),
          scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative flex w-full max-w-3xl overflow-hidden rounded bg-bg-mid"
          style={{ border: "1px solid #2a2520", height: "75vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded text-text-dim transition-colors hover:text-parchment"
          >
            <X className="h-4 w-4" />
          </button>

          {postLoading ? (
            <div className="flex w-full items-center justify-center text-[12px] uppercase tracking-[2px] text-text-dim">
              Consulting the scrolls...
            </div>
          ) : !post ? (
            <div className="flex w-full items-center justify-center text-[12px] uppercase tracking-[2px] text-text-dim">
              Scroll not found
            </div>
          ) : (
            <>
              <div className="flex h-full w-[55%] flex-col border-r border-border-base">
                <div className="border-b border-border-base px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${post.author.id}`}
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        username={post.author.username}
                        avatarUrl={post.author.avatar_url}
                        raceName={post.author.race.name}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-[13px] font-medium text-parchment">
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
                    <span className="ml-auto text-[11px] text-text-dim">
                      {formatTime(post.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <h2 className="mb-3 text-lg font-semibold leading-snug tracking-wide text-parchment">
                    {post.title}
                  </h2>
                  <p className="text-[13px] leading-[1.7] text-text-mid">
                    {post.content}
                  </p>
                </div>

                <div className="border-t border-border-base px-5 py-3">
                  <div className="relative mb-3 h-px bg-border-base after:absolute after:-top-0.75 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rotate-45 after:bg-border-accent" />
                  <div className="flex items-center">
                    <div className="flex flex-1 flex-wrap gap-1">
                      <span className="rounded-[3px] border border-gold/30 bg-bg-surface px-1.75 py-0.5 text-[10px] tracking-[0.5px] text-gold/70">
                        {post.category.name}
                      </span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-[3px] border border-border-accent bg-bg-surface px-1.75 py-0.5 text-[10px] tracking-[0.5px] text-text-mid"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleLike()}
                      className="group/btn flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 12s-5-3.5-5-7a3 3 0 0 1 5-2.24A3 3 0 0 1 12 5c0 3.5-5 7-5 7z"
                          stroke={
                            post.is_liked_by_current_user
                              ? "#c9a84c"
                              : "#3d3428"
                          }
                          fill={
                            post.is_liked_by_current_user ? "#c9a84c" : "none"
                          }
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
                  </div>
                </div>
              </div>

              <div className="flex h-full w-[45%] flex-col pt-10">
                <div
                  ref={scrollContainerRef}
                  className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
                >
                  {commentsLoading ? (
                    <p className="text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                      Loading...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                      No scrolls yet
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <PostComment
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                        currentUserId={user?.id}
                      />
                    ))
                  )}
                </div>

                <div className="p-3">
                  <div className="relative flex items-end rounded border border-border-accent bg-bg-surface transition-colors focus-within:border-gold">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a scroll..."
                      rows={2}
                      className="flex-1 resize-none bg-transparent px-3 py-2 text-[12px] text-parchment placeholder-text-dim outline-none"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!commentText.trim() || isSubmitting}
                      className="mb-2 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-dim transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <path
                          d="M1 12L12 1M12 1H4M12 1V9"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
