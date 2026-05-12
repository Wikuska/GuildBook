import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFeedStore } from "../../store/feedStore";
import { SearchBar } from "./SearchBar";
import { MessagesDropdown } from "./MessagesDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenuDropdown } from "./UserMenuDropdown";
import type { MaybeFeedSection } from "../../utils";

const NAV_ITEMS = ["feed", "market", "help", "contracts"];

type ActiveDropdown = "messages" | "notifications" | "user" | null;

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
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const newPostsFlags = useFeedStore((state) => state.newPostsFlags);

  const toggleDropdown = (dropdown: ActiveDropdown) => {
    setActiveDropdown((current) => (current === dropdown ? null : dropdown));
  };

  const closeDropdowns = () => setActiveDropdown(null);

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
        <MessagesDropdown
          isOpen={activeDropdown === "messages"}
          onToggle={() => toggleDropdown("messages")}
          onClose={closeDropdowns}
        />
        <NotificationsDropdown
          isOpen={activeDropdown === "notifications"}
          onToggle={() => toggleDropdown("notifications")}
          onClose={closeDropdowns}
        />
        <UserMenuDropdown
          isOpen={activeDropdown === "user"}
          onToggle={() => toggleDropdown("user")}
          onClose={closeDropdowns}
        />
      </div>
    </div>
  );
}
