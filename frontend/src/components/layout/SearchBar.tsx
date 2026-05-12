import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSearch } from "../../hooks/search/useUserSearch";
import { useDebounce } from "../../hooks/search/useDebounce";
import { useToggleFollow } from "../../hooks/user";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const follow = useToggleFollow();

  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [], isFetching } = useUserSearch(debouncedQuery);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleCollapse();
      }
    };
    if (expanded) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const handleExpand = () => {
    setExpanded(true);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCollapse = () => {
    setExpanded(false);
    setOpen(false);
    setQuery("");
    setFocusedIdx(-1);
    inputRef.current?.blur();
  };

  const handleSelect = useCallback(
    (user_id: number) => {
      setQuery("");
      handleCollapse();
      navigate(`/profile/${user_id}`);
    },
    [navigate],
  );

  const handleFollow = useCallback(
    (e: React.MouseEvent, user_id: number, is_user_followed: boolean) => {
      e.stopPropagation();
      follow.mutate({ userId: user_id, isFollowing: is_user_followed });
    },
    [follow],
  );

  const showDropdown = open && debouncedQuery.length >= 2;

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <div
        className={`w-8 h-8 rounded bg-bg-surface border border-border-base flex items-center justify-cente overflow-hidden transition-all duration-300 ease-in-out ${
          expanded
            ? "border-gold w-80"
            : "border-[#3d3428] w-8 cursor-pointer hover:border-[#6b5e42]"
        }`}
        onClick={!expanded ? handleExpand : undefined}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-300 ${
            expanded ? "pl-2.5 pr-0" : "w-8 h-8"
          }`}
        >
          <Search
            size={16}
            strokeWidth={1.5}
            className={`text-sage group-hover:text-gold transition-colors duration-200 ${
              expanded ? "text-gold" : "text-[#544a33]"
            }`}
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusedIdx(-1);
          }}
          placeholder="Search the guild..."
          className={`bg-transparent outline-none text-[#d4c4a0] text-[13px] py-2 pr-2 pl-2 placeholder:text-[#544a33] placeholder:text-xs placeholder:tracking-wide transition-all duration-300 ${
            expanded
              ? "w-full opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }`}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+6px)] right-0 w-80 bg-bg-mid border border-border-base rounded z-50 shadow-2xl shadow-black/80
          before:absolute before:top-px before:left-px before:w-2 before:h-2 before:border-t before:border-l before:border-gold
          after:absolute after:bottom-px after:right-px after:w-2 after:h-2 after:border-b after:border-r after:border-gold"
        >
          {isFetching && !results.length ? (
            <div className="px-3 py-3 text-[12px] text-text-dim italic text-center">
              Consulting the scrolls...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1">
                <div className="w-1 h-1 bg-gold rotate-45" />
                <span className="text-[10px] text-text-dim tracking-widest uppercase">
                  Guild members
                </span>
              </div>

              {results.map((user, i) => (
                <div
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors border-t border-transparent
                    ${i === focusedIdx ? "bg-bg-surface border-border-base" : "hover:bg-bg-surface hover:border-border-base"}`}
                >
                  <div className="w-7 h-7 rounded bg-bg-surface border border-border-base flex items-center justify-center text-[11px] font-medium text-gold shrink-0">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-parchment truncate">
                      {highlightMatch(user.username, debouncedQuery)}
                    </div>
                  </div>
                  <span className="text-[10px] text-text-dim bg-bg-surface border border-border-base rounded px-1.5 py-0.5 tracking-wide shrink-0">
                    {user.race.name}
                  </span>
                  <button
                    onClick={(e) => handleFollow(e, user.id, user.is_followed)}
                    className={`group text-[10px] border rounded px-2 py-0.5 transition-all shrink-0 w-20 text-center
                    ${
                      user.is_followed
                        ? "text-text-dim border-border-base hover:border-red-900/50 hover:text-red-500 hover:bg-red-900/10"
                        : "text-text-dim border-border-base hover:border-gold hover:text-gold"
                    }`}
                  >
                    {user.is_followed ? (
                      <>
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:inline">
                          Unfollow
                        </span>
                      </>
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="px-3 py-3 text-[12px] text-text-dim italic text-center">
              No members found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-gold">{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
}
