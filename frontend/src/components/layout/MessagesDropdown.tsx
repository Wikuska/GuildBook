import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import {
  useUnreadMessagesCount,
  useConversations,
} from "../../hooks/conversations";
import { useChatStore } from "../../store/useChatStore";
import { Avatar } from "../ui/Avatar";
import { formatTime } from "../../utils";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MessagesDropdown({ isOpen, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { data: unreadMessagesCount } = useUnreadMessagesCount();
  const { data: conversations = [], isLoading } = useConversations(isOpen);
  const { openConversation } = useChatStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node))
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={onToggle}
        className="w-8 h-8 rounded bg-bg-surface border border-border-base flex items-center justify-center cursor-pointer relative group transition-colors hover:border-gold"
      >
        <MessageSquare
          size={16}
          strokeWidth={1.5}
          className="text-sage group-hover:text-gold"
        />
        {(unreadMessagesCount?.unread_count ?? 0) > 0 && (
          <div className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-gold border-[1.5px] border-bg-mid" />
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 top-10 z-50 w-80 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80
          before:absolute before:-top-px before:-left-px before:h-2.5 before:w-2.5 before:border-l before:border-t before:border-gold
          after:absolute after:-bottom-px after:-right-px after:h-2.5 after:w-2.5 after:border-r after:border-b after:border-gold"
        >
          <div className="flex items-center px-4 py-2.5 border-b border-border-base">
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rotate-45 bg-gold" />
              <span className="text-[10px] uppercase tracking-[1.5px] text-text-dim">
                Messages
              </span>
            </div>
          </div>

          <div className="flex flex-col max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                Gathering scrolls...
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-4 py-6 text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                No messages yet
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    openConversation(conv.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-border-base cursor-pointer transition-colors hover:bg-bg-surface last:border-none ${conv.unread_count > 0 ? "bg-bg-surface/50" : ""}`}
                >
                  <div className="shrink-0 w-1.5">
                    {conv.unread_count > 0 && (
                      <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                    )}
                  </div>
                  <Avatar
                    username={conv.other_participant.username}
                    avatarUrl={conv.other_participant.avatar_url}
                    raceName={conv.other_participant.race.name}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[12px] font-medium text-parchment">
                        {conv.other_participant.username}
                      </span>
                      {conv.last_message && (
                        <span className="text-[10px] text-text-dim shrink-0">
                          {formatTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-dim truncate">
                      {conv.last_message
                        ? conv.last_message.content
                        : "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
