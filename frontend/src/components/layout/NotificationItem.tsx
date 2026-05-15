import { useMarkOneRead } from "../../hooks/notifications";
import { Avatar } from "../ui/Avatar";
import { formatTime } from "../../utils";
import type { NotificationResponse } from "../../api/notifications";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: NotificationResponse;
  onClose: () => void;
}

export function NotificationItem({
  notification: n,
  onClose,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: markOne } = useMarkOneRead();

  const handleClick = () => {
    if (!n.is_read) markOne(n.id);
    if (n.type === "follow") {
      navigate(`/profile/${n.actor.id}`);
    } else if (n.post_id) {
      navigate(`/post/${n.post_id}`, {
        state: { background: location, feedQueryKey: null },
      });
    }
    onClose();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 border-b border-border-base cursor-pointer transition-colors hover:bg-bg-surface last:border-none
        ${!n.is_read ? "bg-bg-surface/50" : ""}`}
    >
      <div className="mt-1.5 shrink-0 w-1.5">
        {!n.is_read && <div className="h-1.5 w-1.5 rounded-full bg-gold" />}
      </div>
      <Link
        to={`/profile/${n.actor.id}`}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      >
        <Avatar
          username={n.actor.username}
          avatarUrl={n.actor.avatar_url}
          raceName={n.actor.race.name}
          size="sm"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] leading-snug">
          <Link
            to={`/profile/${n.actor.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-parchment hover:text-gold transition-colors"
          >
            {n.actor.username}
          </Link>
          <span className="text-text-mid">
            {n.type === "follow" && " started following you"}
            {n.type === "post_like" && " liked your post"}
            {n.type === "post_comment" && " commented on your post"}
          </span>
        </div>
        <div className="mt-0.5 text-[10px] text-text-dim">
          {formatTime(n.created_at)}
        </div>
      </div>
    </div>
  );
}
