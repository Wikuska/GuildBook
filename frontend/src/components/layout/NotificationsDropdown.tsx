import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import {
  useUnreadCount,
  useNotifications,
  useMarkAllRead,
} from "../../hooks/notifications";
import { NotificationItem } from "./NotificationItem";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { data: unreadCount } = useUnreadCount();
  const { data: notifications = [], isLoading } = useNotifications(isOpen);
  const { mutate: markAll } = useMarkAllRead();

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
        <Bell
          size={16}
          strokeWidth={1.5}
          className="text-sage group-hover:text-gold"
        />
        {(unreadCount?.unread_count ?? 0) > 0 && (
          <div className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-gold border-[1.5px] border-bg-mid" />
        )}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 top-10 z-50 w-80 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80
          before:absolute before:-top-px before:-left-px before:h-2.5 before:w-2.5 before:border-l before:border-t before:border-gold
          after:absolute after:-bottom-px after:-right-px after:h-2.5 after:w-2.5 after:border-r after:border-b after:border-gold"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-base">
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rotate-45 bg-gold" />
              <span className="text-[10px] uppercase tracking-[1.5px] text-text-dim">
                Notifications
              </span>
            </div>
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={() => markAll()}
                className="text-[10px] uppercase tracking-[1px] text-text-dim hover:text-gold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="flex flex-col max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                Gathering whispers...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-[11px] uppercase tracking-[1.5px] text-text-dim">
                No whispers yet
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClose={onClose}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
