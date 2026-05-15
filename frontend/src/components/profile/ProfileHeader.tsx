import { Avatar } from "../ui/Avatar";
import type { PublicUserResponse } from "../../api/users";
import { formatMembershipDate } from "../../utils";
import { useToggleFollow } from "../../hooks/user/useToggleFollow";
import { useCreateConversation } from "../../hooks/conversations";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profile: PublicUserResponse;
  isOwnProfile?: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const follow = useToggleFollow();
  const createConversation = useCreateConversation();
  const navigate = useNavigate();

  return (
    <div className="relative shrink-0 border-b border-border-base px-8 pb-6">
      <div className="-mt-23 mb-4 flex items-end gap-5">
        <div className="relative shrink-0">
          <div className="absolute -left-1 -top-1 h-2.25 w-2.25 border-l border-t border-sage"></div>
          <Avatar
            username={profile.username}
            avatarUrl={profile.avatar_url}
            raceName={profile.race.name}
            size="xl"
          />
          <div className="absolute -bottom-1 -right-1 h-2.25 w-2.25 border-b border-r border-sage"></div>
        </div>

        <div className="ml-auto flex gap-2 pb-1">
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/settings")}
              className="rounded-sm border border-border-accent bg-bg-surface px-3.5 py-1.5 text-[11px] uppercase tracking-[1.5px] text-text-mid transition-colors hover:border-text-dim hover:text-text-dim"
            >
              Edit Profile
            </button>
          ) : (
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  createConversation.mutate(Number(profile.id));
                }}
                className="rounded-sm border border-border-accent bg-bg-surface px-3.5 py-1.5 text-[11px] uppercase tracking-[1.5px] text-text-mid transition-colors hover:border-text-dim hover:text-text-dim"
              >
                Message
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  follow.mutate({
                    userId: profile.id,
                    isFollowing: profile.is_followed_by_current_user,
                  });
                }}
                className={`relative rounded-sm border px-4 py-1.5 text-[11px] uppercase tracking-[1.5px] transition-colors ${
                  profile.is_followed_by_current_user
                    ? "border-border-accent bg-bg-surface text-sage hover:border-[#8b2020] hover:text-[#8b2020]"
                    : "border-gold bg-bg-surface text-gold hover:bg-bg-hover"
                }`}
              >
                {!profile.is_followed_by_current_user && (
                  <>
                    <div className="absolute -left-0.5 -top-0.5 h-1.25 w-1.25 border-l border-t border-sage"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-1.25 w-1.25 border-b border-r border-sage"></div>
                  </>
                )}
                {profile.is_followed_by_current_user ? "Following" : "Follow"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-1 flex items-center gap-2 text-xl font-medium text-parchment">
        {profile.username}
        <span className="rounded-sm border border-border-accent bg-bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[1.5px] text-sage">
          {profile.race.name}
        </span>
      </div>

      <div className="mb-2.5 max-w-130 text-[13px] leading-relaxed text-text-mid">
        {profile.bio || "No biography added yet."}
      </div>

      <div className="mb-3.5 flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-xs text-text-dim">
          <div className="h-1 w-1 rotate-45 bg-sage"></div>
          {profile.location || "Unknown"}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-dim">
          <div className="h-1 w-1 rotate-45 bg-sage"></div>
          Member since {formatMembershipDate(profile.created_at)}
        </div>
      </div>

      <div className="flex gap-6">
        {[
          { label: "Posts", num: profile.posts_count.toString() },
          { label: "Following", num: profile.following_count.toString() },
          { label: "Followers", num: profile.followers_count.toString() },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-[15px] font-medium text-gold">
              {stat.num}
            </span>
            <span className="text-[10px] uppercase tracking-[1px] text-text-dim">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
