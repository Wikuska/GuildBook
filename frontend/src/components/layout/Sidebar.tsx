import { Avatar } from "../ui/Avatar";
import { useEffect } from "react";
import { useFilterStore } from "../../store/FilterStore";
import { useTags } from "../../hooks/lookup";
import { useCurrentUser } from "../../hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useFeedStore } from "../../store/feedStore";
import { ArrowUp } from "lucide-react";
import { useCurrentSection } from "../../hooks/ui/useCurrentSection";

function TagButton({
  label,
  isActive,
  onClick,
  count,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-1.5 rounded border px-2 py-1.5 text-left transition-all xl:gap-2 xl:px-2.5 xl:py-2 ${
        isActive
          ? "border-border-accent bg-bg-surface"
          : "border-transparent hover:border-border-accent hover:bg-bg-surface"
      }`}
    >
      <div
        className={`h-1.25 w-1.25 shrink-0 rotate-45 transition-colors xl:h-1.5 xl:w-1.5 ${
          isActive ? "bg-gold" : "bg-border-accent"
        }`}
      />
      <span
        className={`flex-1 capitalize text-xs transition-colors xl:text-sm ${
          isActive ? "text-gold" : "text-text-mid group-hover:text-gold"
        }`}
      >
        {label}
      </span>
      {count != null && (
        <span className="text-[10px] text-text-dim xl:text-xs">{count}</span>
      )}
    </button>
  );
}

export function Sidebar() {
  const { selectedTag, setSelectedTag } = useFilterStore();
  const { data: tags, isLoading, isError } = useTags();
  const { data: user } = useCurrentUser();

  const currentSection = useCurrentSection();
  const queryClient = useQueryClient();
  const setNewPostsFlag = useFeedStore((state) => state.setNewPostsFlag);

  useEffect(() => {
    if (currentSection) {
      setNewPostsFlag(currentSection, false);
    }
  }, [currentSection, setNewPostsFlag]);

  const showRefreshButton = useFeedStore((state) =>
    currentSection ? state.newPostsFlags[currentSection] : false,
  );

  const handleRefresh = () => {
    if (!currentSection) return;
    setNewPostsFlag(currentSection, false);
    queryClient.invalidateQueries({ queryKey: ["posts", currentSection] });
    document
      .getElementById("main-scroll-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside className="relative flex w-55 min-w-55 shrink-0 flex-col gap-6 border-r border-border-base bg-bg-mid px-4 py-5 transition-all lg:w-60 lg:px-4 lg:py-6 xl:w-64 xl:gap-7 xl:px-5 xl:py-7 after:absolute after:-right-0.75 after:bottom-0 after:top-0 after:w-0.5">
      <div
        className="relative flex flex-col items-center pb-6 transition-all xl:pb-7 
        after:absolute after:bottom-0 after:left-[15%] after:right-[15%] after:h-px after:bg-border-accent 
        before:absolute before:-bottom-1 before:left-1/2 before:h-1.75 before:w-1.75 before:-translate-x-1/2 before:rotate-45 before:bg-sage xl:before:h-2 xl:before:w-2"
      >
        <div
          className="relative mb-2.5 transition-all xl:mb-3 
          before:absolute before:-left-0.75 before:-top-0.75 before:h-1.75 before:w-1.75 before:border-l before:border-t before:border-sage xl:before:-left-1 xl:before:-top-1 xl:before:h-2 xl:before:w-2
          after:absolute after:-bottom-0.75 after:-right-0.75 after:h-1.75 after:w-1.75 after:border-b after:border-r after:border-sage xl:after:-bottom-1 xl:after:-right-1 xl:after:h-2 xl:after:w-2"
        >
          <div className="transform transition-transform xl:scale-105">
            <Avatar
              username={user?.username}
              avatarUrl={user?.avatar_url}
              raceName={user?.race.name}
              size="lg"
            />
          </div>
        </div>

        <div className="mb-1 text-sm font-medium text-parchment xl:text-base">
          {user?.username}
        </div>

        <div className="mb-2.5 rounded border border-border-accent bg-bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[1.5px] text-sage xl:mb-3 xl:px-2.5 xl:py-1 xl:text-[11px]">
          {user?.race.name}
        </div>

        <div className="flex gap-5 xl:gap-7">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gold xl:text-base">
              {user?.following_count}
            </span>
            <span className="text-[10px] uppercase tracking-[1px] text-text-dim xl:text-[11px]">
              Following
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gold xl:text-base">
              {user?.followers_count}
            </span>
            <span className="text-[10px] uppercase tracking-[1px] text-text-dim xl:text-[11px]">
              Followers
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-text-dim xl:mb-3 xl:gap-2 xl:text-[12px] before:h-1 before:w-1 before:shrink-0 before:rotate-45 before:bg-sage xl:before:h-1.5 xl:before:w-1.5">
          Filter by tag
        </div>

        <div className="flex flex-col gap-1 xl:gap-1.5">
          {isLoading && (
            <div className="px-2 py-1.5 text-xs text-text-dim xl:text-sm">
              Gathering tags...
            </div>
          )}

          {isError && (
            <div className="px-2 py-1.5 text-xs text-red-900/50 xl:text-sm">
              Failed to read magical signs.
            </div>
          )}

          <TagButton
            label="All"
            isActive={selectedTag === null}
            onClick={() => setSelectedTag(null)}
          />

          {tags &&
            tags.map((tag) => (
              <TagButton
                key={tag.id || tag.name}
                label={tag.name}
                isActive={selectedTag?.id === tag.id}
                onClick={() => setSelectedTag(tag)}
              />
            ))}
        </div>
      </div>

      {showRefreshButton && (
        <div className="sticky bottom-4 mt-auto flex justify-center pt-4 xl:pt-5">
          <button
            onClick={handleRefresh}
            className="flex w-full animate-pulse items-center justify-center gap-2 rounded border border-gold/50 bg-bg-surface px-4 py-2 text-sm font-semibold text-gold shadow-lg transition-all hover:border-gold hover:bg-gold/10 xl:text-base"
          >
            New scrolls await! <ArrowUp size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
