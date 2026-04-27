import { ProfileBanner } from "../components/profile/ProfileBanner";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileRightPanel } from "../components/profile/ProfileRightPanel";
import { PostFeed } from "../components/posts/PostFeed";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/user";
import { useUserProfile } from "../hooks/user/useUserProfile";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: currentUser } = useCurrentUser();
  const { data: profile, isLoading, isError } = useUserProfile(id);

  const isOwnProfile = currentUser?.id === Number(id);

  if (isLoading) {
    return (
      <div className="text-text-dim text-center mt-10">
        Consulting the bestiary...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-red-900/50 text-center mt-10">Scroll not found.</div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-deep text-text-mid font-sans selection:bg-gold selection:text-bg-deep">
      <div className="mx-auto flex w-full max-w-360 flex-col border-x border-border-base shadow-2xl relative overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 flex-col overflow-y-auto custom-scrollbar">
            <ProfileBanner bannerUrl={profile.banner_url} />
            <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
            <div className="flex flex-1 min-h-0">
              <div className="flex-1 border-r border-border-base">
                <PostFeed
                  endpoint={`posts/user/${profile.id}`}
                  title="Scrolls"
                  profileView={true}
                />
              </div>
              <ProfileRightPanel />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
