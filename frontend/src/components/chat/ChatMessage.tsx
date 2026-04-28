import { formatTime } from "../../utils";
import type { MessageResponse } from "../../api/conversations";

interface ChatMessageProps {
  message: MessageResponse;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded px-3 py-2 ${
          isOwn
            ? "bg-bg-surface border border-gold/20 rounded-br-none"
            : "bg-bg-deep border border-border-base rounded-bl-none"
        }`}
      >
        <p className="text-[12px] leading-[1.6] text-text-mid">
          {message.content}
        </p>
        <div
          className={`mt-0.5 text-[10px] text-text-dim flex items-center gap-1 ${isOwn ? "justify-end" : ""}`}
        >
          {formatTime(message.created_at)}
          {isOwn && (
            <span className={message.is_read ? "text-gold" : "text-text-dim"}>
              {message.is_read ? "·· read" : "· sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
