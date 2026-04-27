import { Avatar } from "../ui/Avatar";
import { formatTime } from "../../utils";
import { Swords, Feather, Check, X } from "lucide-react";
import { useState } from "react";
import { useDeleteComment, useUpdateComment } from "../../hooks/comments";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: {
    id: number;
    username: string;
    avatar_url: string | null;
    race: {
      name: string;
    };
  };
}

interface PostCommentProps {
  comment: Comment;
  postId: number;
  currentUserId: number | undefined;
}

export function PostComment({
  comment,
  postId,
  currentUserId,
}: PostCommentProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const deleteCommentMutation = useDeleteComment(postId);
  const updateCommentMutation = useUpdateComment(postId);

  const handleEditSubmit = () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      return;
    }
    updateCommentMutation.mutate(
      { commentId: comment.id, content: trimmed },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
    if (e.key === "Escape") {
      setEditText(comment.content);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="group flex gap-2.5"
      onMouseLeave={() => setConfirmDelete(false)}
    >
      <Avatar
        username={comment.author.username}
        avatarUrl={comment.author.avatar_url}
        raceName={comment.author.race.name}
        size="sm"
      />
      <div className="flex-1 rounded bg-bg-surface border border-border-accent px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-parchment">
            {comment.author.username}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-dim">
              {formatTime(comment.created_at)}
            </span>
            {currentUserId === comment.author.id && (
              <div className="hidden group-hover:flex items-center gap-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleEditSubmit}
                      className="text-text-dim hover:text-gold transition-colors"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setEditText(comment.content);
                        setIsEditing(false);
                      }}
                      className="text-text-dim hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-text-dim hover:text-gold transition-colors"
                    >
                      <Feather className="w-3 h-3" />
                    </button>
                    {confirmDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCommentMutation.mutate(comment.id);
                            setConfirmDelete(false);
                          }}
                          className="text-[8px] uppercase tracking-[1px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          confirm
                        </button>
                        <span className="text-border-accent">·</span>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="text-[8px] uppercase tracking-[1px] text-text-dim hover:text-text-mid transition-colors"
                        >
                          cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="text-text-dim hover:text-red-400 transition-colors"
                      >
                        <Swords className="w-3 h-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleEditKeyDown}
            rows={2}
            autoFocus
            className="w-full resize-none rounded border border-border-accent bg-bg-deep px-2 py-1.5 text-[12px] text-parchment placeholder-text-dim outline-none transition-colors focus:border-gold"
          />
        ) : (
          <p className="text-[12px] leading-[1.6] text-text-mid">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}
