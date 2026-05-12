import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/user";
import { useAuthStore } from "../../store/authStore";
import { Avatar } from "../ui/Avatar";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function UserMenuDropdown({ isOpen, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node))
        onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <div onClick={onToggle} className="cursor-pointer">
        <Avatar
          username={user?.username ?? "?"}
          avatarUrl={user?.avatar_url}
          raceName={user?.race?.name}
          size="sm"
        />
      </div>

      {isOpen && (
        <div
          className="absolute right-0 top-10 z-50 w-44 rounded bg-bg-mid border border-border-base overflow-hidden shadow-2xl shadow-black/80
          before:absolute before:-top-px before:-left-px before:h-2.5 before:w-2.5 before:border-l before:border-t before:border-gold
          after:absolute after:-bottom-px after:-right-px after:h-2.5 after:w-2.5 after:border-r after:border-b after:border-gold"
        >
          <Link
            to={`/profile/${user?.id}`}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[1.5px] text-text-dim hover:text-parchment hover:bg-bg-surface"
          >
            <div className="h-1 w-1 rotate-45 bg-sage shrink-0" />
            View profile
          </Link>
          <div className="h-px bg-border-base" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[1.5px] text-text-dim hover:text-gold hover:bg-bg-surface"
          >
            <div className="h-1 w-1 rotate-45 bg-sage shrink-0" />
            Leave guild
          </button>
        </div>
      )}
    </div>
  );
}
