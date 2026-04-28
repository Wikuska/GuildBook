import { useEffect, useRef, useState } from "react";
import { X, Minus } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useMessages } from "../../hooks/conversations/useMessages";
import { useSendMessage } from "../../hooks/conversations/useSendMessage";
import { useMarkConversationRead } from "../../hooks/conversations/useMarkConversationRead";
import { useCurrentUser } from "../../hooks/user/useCurrentUser";
import { useConversations } from "../../hooks/conversations/useConversations";
import { Avatar } from "../ui/Avatar";
import { ChatMessage } from "./ChatMessage";

interface ChatWindowProps {
  conversationId: number;
  index: number;
}

export function ChatWindow({ conversationId, index }: ChatWindowProps) {
  const { closeConversation } = useChatStore();
  const { data: currentUser } = useCurrentUser();
  const { data: conversations = [] } = useConversations(true);
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);
  const { mutate: markRead } = useMarkConversationRead();
  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const other = conversation?.other_participant;

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, minimized]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    sendMessage(trimmed, { onSuccess: () => setText("") });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const rightOffset = 16 + index * 296;

  return (
    <div
      className="fixed bottom-0 z-30 flex flex-col overflow-hidden rounded-t bg-bg-mid border border-border-base border-b-0"
      style={{
        width: "280px",
        right: `${rightOffset}px`,
      }}
    >
      <div className="pointer-events-none absolute -left-px -top-px h-2 w-2 border-l border-t border-gold z-10" />
      <div className="pointer-events-none absolute -right-px -top-px h-2 w-2 border-r border-t border-gold z-10" />

      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-border-base bg-bg-surface cursor-pointer select-none"
        onClick={() => setMinimized((v) => !v)}
      >
        {other && (
          <Avatar
            username={other.username}
            avatarUrl={other.avatar_url}
            raceName={other.race.name}
            size="sm"
          />
        )}
        <span className="flex-1 text-[12px] font-medium text-parchment truncate">
          {other?.username ?? "..."}
        </span>
        {conversation && conversation.unread_count > 0 && (
          <div className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMinimized((v) => !v);
          }}
          className="text-text-dim hover:text-parchment transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeConversation(conversationId);
          }}
          className="text-text-dim hover:text-red-400 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {!minimized && (
        <>
          <div
            className="flex flex-col gap-2 overflow-y-auto p-3"
            style={{ height: "260px" }}
          >
            {isLoading ? (
              <p className="text-center text-[11px] uppercase tracking-[1.5px] text-text-dim mt-4">
                Loading...
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-[11px] uppercase tracking-[1.5px] text-text-dim mt-4">
                No messages yet
              </p>
            ) : (
              messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  isOwn={m.sender_id === currentUser?.id}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border-base p-2">
            <div className="relative flex items-end rounded border border-border-accent bg-bg-surface focus-within:border-gold transition-colors">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-2.5 py-2 text-[12px] text-parchment placeholder-text-dim outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || isPending}
                className="mb-1.5 mr-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-text-dim transition-colors hover:text-gold disabled:opacity-30"
              >
                <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
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
        </>
      )}
    </div>
  );
}
