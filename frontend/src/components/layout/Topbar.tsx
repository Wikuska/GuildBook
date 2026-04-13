import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Avatar } from "../ui/Avatar";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_ITEMS = ["feed", "market", "help", "Contracts"];

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

const NotificationBell = () => (
  <div className="w-8 h-8 rounded bg-bg-surface border border-border-base flex items-center justify-center cursor-pointer relative group transition-colors hover:border-gold">
    <Bell
      size={16}
      strokeWidth={1.5}
      className="text-sage transition-colors group-hover:text-gold"
    />
    <div className="absolute top-1 right-1 w-1.75 h-1.75 rounded-full bg-gold border-[1.5px] border-bg-input" />
  </div>
);

export function Topbar({ activePage = "feed" }: { activePage?: string }) {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex items-center h-13 px-6 gap-8 relative border-b bg-bg-mid border-border-base">
      <div className="flex items-center gap-2 mr-4 uppercase tracking-[2px] text-base font-medium text-gold">
        <div className="w-1.75 h-1.75 rotate-45 shrink-0 bg-sage" />
        GuildBook
      </div>

      <nav className="flex flex-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item} to={`/${item}`}>
            <NavItem key={item} label={item} isActive={item === activePage} />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        <NotificationBell />
        <Link to={`/profile/${user?.id}`}>
          <Avatar
            username={user?.username ?? "?"}
            raceName={user?.race?.name}
            size="sm"
          />
        </Link>
      </div>
    </div>
  );
}
