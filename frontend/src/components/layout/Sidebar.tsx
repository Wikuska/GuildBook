import { Avatar } from "../ui/Avatar";
import { useFilterStore } from "../../store/FilterStore";
import { useTags } from "../../hooks/useTags";
import { useCurrentUser } from "../../hooks/useCurrentUser";

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
      className={`group flex w-full items-center gap-1.5 rounded border px-2 py-1.5 text-left transition-all ${
        isActive
          ? "border-border-accent bg-bg-surface"
          : "border-transparent hover:border-border-accent hover:bg-bg-surface"
      }`}
    >
      <div
        className={`h-1.25 w-1.25 shrink-0 rotate-45 transition-colors ${isActive ? "bg-gold" : "bg-border-accent"}`}
      />
      <span
        className={`flex-1  capitalize text-xs transition-colors ${isActive ? "text-gold" : "text-text-mid group-hover:text-gold"}`}
      >
        {label}
      </span>
      {count != null && (
        <span className="text-[10px] text-text-dim">{count}</span>
      )}
    </button>
  );
}

export function Sidebar() {
  const { selectedTag, setSelectedTag } = useFilterStore();
  const { data: tags, isLoading, isError } = useTags();
  const { data: user } = useCurrentUser();

  return (
    <aside className="relative flex w-55 min-w-55 shrink-0 flex-col gap-6 border-r border-border-base bg-bg-mid px-4 py-5 after:absolute after:-right-0.75 after:bottom-0 after:top-0 after:w-0.5">
      <div
        className="relative flex flex-col items-center pb-6 
        after:absolute after:bottom-0 after:left-[15%] after:right-[15%] after:h-px after:bg-border-accent 
        before:absolute before:-bottom-1 before:left-1/2 before:h-1.75 before:w-1.75 before:-translate-x-1/2 before:rotate-45 before:bg-sage"
      >
        <div
          className="relative mb-2.5 
          before:absolute before:-left-0.75 before:-top-0.75 before:h-1.75 before:w-1.75 before:border-l before:border-t before:border-sage 
          after:absolute after:-bottom-0.75 after:-right-0.75 after:h-1.75 after:w-1.75 after:border-b after:border-r after:border-sage"
        >
          <Avatar
            username={user?.username}
            avatarUrl={user?.avatar_url}
            raceName={user?.race.name}
            size="lg"
          />
        </div>

        <div className="mb-1 text-sm font-medium text-parchment">
          {user?.username}
        </div>

        <div className="mb-2.5 rounded border border-border-accent bg-bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[1.5px] text-sage">
          {user?.race.name}
        </div>

        <div className="flex gap-5">
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gold">
              {user?.following_count}
            </span>
            <span className="text-[10px] uppercase tracking-[1px] text-text-dim">
              Following
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gold">
              {user?.followers_count}
            </span>
            <span className="text-[10px] uppercase tracking-[1px] text-text-dim">
              Followers
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-text-dim before:h-1 before:w-1 before:shrink-0 before:rotate-45 before:bg-sage">
          Filter by tag
        </div>

        <div className="flex flex-col gap-1">
          {isLoading && (
            <div className="text-xs text-text-dim px-2 py-1.5">
              Gathering tags...
            </div>
          )}

          {isError && (
            <div className="text-xs text-red-900/50 px-2 py-1.5">
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
    </aside>
  );
}
