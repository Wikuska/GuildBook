import { useEffect, useRef, useState } from "react";
import {
  useUnreadCount,
  useNotifications,
  useMarkAllRead,
} from "../../hooks/notifications";
import {
  useUnreadMessagesCount,
  useConversations,
} from "../../hooks/conversations";
import { useChatStore } from "../../store/useChatStore";
import { useCurrentUser } from "../../hooks/user";
import { Avatar } from "../ui/Avatar";
import { Bell, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NotificationItem } from "./NotificationItem";
import { formatTime } from "../../utils";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useFeedStore } from "../../store/feedStore";
import type { MaybeFeedSection } from "../../utils";
import { SearchBar } from "./SearchBar";

const NAV_ITEMS = ["feed", "market", "help", "contracts"];

const NavItem = ({
  label,
  isActive = false,
  hasNew = false,
}: {
  label: string;
  isActive?: boolean;
  hasNew?: boolean;
}) => (
  <div
    className={`relative px-4 h-13 flex items-center text-xs tracking-[1.5px] uppercase cursor-pointer transition-colors duration-150 border-b-2 -mb-px
      ${isActive ? "text-parchment border-gold" : "text-sage border-transparent hover:text-gold"}`}
  >
    {label}

    {hasNew && (
      <span className="absolute top-3 right-1.5 h-1.5 w-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_5px_rgba(212,175,55,0.8)]" />
    )}
  </div>
);

export function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [notifOpen, setNotifOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCount();
  const { data: notifications = [], isLoading: notifLoading } =
    useNotifications(notifOpen);
  const { mutate: markAll } = useMarkAllRead();

  const { data: unreadMessagesCount } = useUnreadMessagesCount();
  const { data: conversations = [], isLoading: convsLoading } =
    useConversations(messagesOpen);
  const { openConversation } = useChatStore();

  const logout = useAuthStore((s) => s.logout);

  const newPostsFlags = useFeedStore((state) => state.newPostsFlags);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        messagesRef.current &&
        !messagesRef.current.contains(e.target as Node)
      ) {
        setMessagesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center h-13 px-6 gap-8 relative border-b bg-bg-mid border-border-base">
      <div className="flex items-center gap-2 mr-4 uppercase tracking-[2px] text-base font-medium text-gold">
        <div className="w-1.75 h-1.75 rotate-45 shrink-0 bg-sage" />
        GuildBook
      </div>

      <nav className="flex flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === `/feed/${item === "feed" ? "" : item}` ||
            (item === "feed" && pathname === "/feed");
          const hasNew = newPostsFlags[item as NonNullable<MaybeFeedSection>];

          return (
            <Link key={item} to={`/feed/${item === "feed" ? "" : item}`}>
              <NavItem
                label={item}
                isActive={isActive}
                hasNew={hasNew && !isActive}
              />
            </Link>
          );
        })}
      </nav>

      <SearchBar />

      <div className="flex items-center gap-3 ml-auto">
        {/* Messages */}
        <div className="relative" ref={messagesRef}>
          <div
            onClick={() => {
              setMessagesOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="w-8 h-8 rounded bg-bg-surface border border-border-base flex items-center justify-center cursor-pointer relative group transition-colors hover:border-gold"
          >
            <MessageSquare
              size={16}
              strokeWidth={1.5}
              className="text-sage transition-colors group-hover:text-gold"
            />
            {(unreadMessagesCount?.unread_count ?? 0) > 0 && (
              <div className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-gold border-[1.5px] border-bg-mid" />
            )}
          </div>

          {messagesOpen && (
            <div
              className="absolute right-0 top-10 z-50 w-80 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80
              before:absolute before:-top-px before:-left-px before:h-2.5 before:w-2.5 before:border-l before:border-t before:border-gold
              after:absolute after:-bottom-px after:-right-px after:h-2.5 after:w-2.5 after:border-r after:border-b after:border-gold"
            >
              {/* Header */}
              <div className="flex items-center px-4 py-2.5 border-b border-border-base">
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rotate-45 bg-gold" />
                  <span className="text-[10px] uppercase tracking-[1.5px] text-text-dim">
                    Messages
                  </span>
                </div>
              </div>

              {/* List */}
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {convsLoading ? (
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
                        setMessagesOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-border-base cursor-pointer transition-colors hover:bg-bg-surface last:border-none
                        ${conv.unread_count > 0 ? "bg-bg-surface/50" : ""}`}
                    >
                      {/* Unread dot */}
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

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <div
            onClick={() => {
              setNotifOpen((v) => !v);
              setMessagesOpen(false);
            }}
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

          {notifOpen && (
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
                {notifLoading ? (
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
                      onClose={() => setNotifOpen(false)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <div
            onClick={() => setUserMenuOpen((v) => !v)}
            className="cursor-pointer"
          >
            <Avatar
              username={user?.username ?? "?"}
              avatarUrl={user?.avatar_url}
              raceName={user?.race?.name}
              size="sm"
            />
          </div>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-10 z-50 w-44 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80
              before:absolute before:-top-px before:-left-px before:h-2.5 before:w-2.5 before:border-l before:border-t before:border-gold
              after:absolute after:-bottom-px after:-right-px after:h-2.5 after:w-2.5 after:border-r after:border-b after:border-gold"
            >
              <Link
                to={`/profile/${user?.id}`}
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[1.5px] text-text-dim hover:text-parchment hover:bg-bg-surface transition-colors"
              >
                <div className="h-1 w-1 rotate-45 bg-sage shrink-0" />
                View profile
              </Link>
              <div className="h-px bg-border-base" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[1.5px] text-text-dim hover:text-gold hover:bg-bg-surface transition-colors"
              >
                <div className="h-1 w-1 rotate-45 bg-sage shrink-0" />
                Leave guild
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
