import { useEffect, useRef, useState } from "react";
import {
  useUnreadCount,
  useNotifications,
  useMarkAllRead,
} from "../../hooks/notifications";
import { useCurrentUser } from "../../hooks/user";
import { Avatar } from "../ui/Avatar";
import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NotificationItem } from "./NotificationItem";

const NAV_ITEMS = ["feed", "market", "help", "contracts"];

const NavItem = ({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) => (
  <div
    className={`px-4 h-13 flex items-center text-xs tracking-[1.5px] uppercase cursor-pointer transition-colors duration-150 border-b-2 -mb-px
      ${isActive ? "text-parchment border-gold" : "text-sage border-transparent hover:text-gold"}`}
  >
    {label}
  </div>
);

export function Topbar() {
  const { pathname } = useLocation();
  const { data: user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCount();
  const { data: notifications = [], isLoading } = useNotifications(isOpen);
  const { mutate: markAll } = useMarkAllRead();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center h-13 px-6 gap-8 relative border-b bg-bg-mid border-border-base">
      <div className="flex items-center gap-2 mr-4 uppercase tracking-[2px] text-base font-medium text-gold">
        <div className="w-1.75 h-1.75 rotate-45 shrink-0 bg-sage" />
        GuildBook
      </div>

      <nav className="flex flex-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item} to={`/feed/${item === "feed" ? "" : item}`}>
            <NavItem
              label={item}
              isActive={
                pathname === `/feed/${item === "feed" ? "" : item}` ||
                (item === "feed" && pathname === "/feed")
              }
            />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        <div className="relative" ref={ref}>
          <div
            onClick={() => setIsOpen((v) => !v)}
            className="w-8 h-8 rounded bg-bg-surface border border-border-base flex items-center justify-center cursor-pointer relative group transition-colors hover:border-gold"
          >
            <Bell
              size={16}
              strokeWidth={1.5}
              className="text-sage transition-colors group-hover:text-gold"
            />
            {(unreadCount?.unread_count ?? 0) > 0 && (
              <div className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-gold border-[1.5px] border-bg-mid" />
            )}
          </div>

          {isOpen && (
            <div
              className="absolute right-0 top-10 z-50 w-80 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-black/40
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
                    className="text-[10px] uppercase tracking-[1px] text-text-dim hover:text-gold transition-colors"
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
                      onClose={() => setIsOpen(false)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to={`/profile/${user?.id}`}>
          <Avatar
            username={user?.username ?? "?"}
            avatarUrl={user?.avatar_url}
            raceName={user?.race?.name}
            size="sm"
          />
        </Link>
      </div>
    </div>
  );
}
