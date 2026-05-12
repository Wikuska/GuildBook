import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSearch } from "../../hooks/search/useUserSearch";
import { useDebounce } from "../../hooks/search/useDebounce";
import { useToggleFollow } from "../../hooks/user";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const follow = useToggleFollow();

  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [], isFetching } = useUserSearch(debouncedQuery);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIdx(-1);
  }, []);

  const handleSelect = useCallback(
    (user_id: number) => {
      setQuery("");
      close();
      navigate(`/profile/${user_id}`);
    },
    [navigate, close],
  );

  const handleFollow = useCallback(
    (e: React.MouseEvent, user_id: number) => {
      e.stopPropagation();
      follow.mutate({ userId: user_id, isFollowing: false });
    },
    [follow],
  );

  const showDropdown = open && debouncedQuery.length >= 2;

  return (
    <div className="relative flex-1 max-w-xs mx-auto">
      {/* Input */}
      <div
        className={`flex items-center bg-[#0a0906] border rounded transition-all duration-200 ${
          open ? "border-gold w-full" : "border-[#3d3428] w-48"
        }`}
      >
        <SearchIcon
          className={`ml-2.5 shrink-0 ${open ? "text-gold" : "text-[#544a33]"}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusedIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(close, 150)}
          placeholder="Search the guild..."
          className="flex-1 bg-transparent outline-none text-[#d4c4a0] text-[13px] py-2 pr-2 placeholder:text-[#544a33] placeholder:text-xs placeholder:tracking-wide"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#100e0b] border border-[#3d3428] rounded z-50
          before:absolute before:top-px before:left-px before:w-2 before:h-2 before:border-t before:border-l before:border-[#6b5e42]
          after:absolute after:bottom-px after:right-px after:w-2 after:h-2 after:border-b after:border-r after:border-[#6b5e42]"
        >
          {isFetching && !results.length ? (
            <div className="px-3 py-3 text-[12px] text-[#544a33] italic text-center">
              Consulting the scrolls...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1">
                <div className="w-1 h-1 bg-[#6b5e42] rotate-45" />
                <span className="text-[10px] text-[#544a33] tracking-widest uppercase">
                  Guild members
                </span>
              </div>

              {results.map((user, i) => (
                <div
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors border-t border-transparent
                    ${i === focusedIdx ? "bg-[#1a1408] border-[#2a2520]" : "hover:bg-[#1a1408] hover:border-[#2a2520]"}`}
                >
                  <div className="w-7 h-7 rounded bg-[#1a1408] border border-[#3d3428] flex items-center justify-center text-[11px] font-medium text-gold shrink-0">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#d4c4a0] truncate">
                      {highlightMatch(user.username, debouncedQuery)}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6b5e42] bg-[#1a1408] border border-[#2a2520] rounded px-1.5 py-0.5 tracking-wide shrink-0">
                    {user.race.name}
                  </span>
                  {!user.is_followed && (
                    <button
                      onClick={(e) => handleFollow(e, user.id)}
                      className="text-[10px] text-[#6b5e42] border border-[#3d3428] rounded px-2 py-0.5 hover:border-gold hover:text-gold transition-colors shrink-0"
                    >
                      Follow
                    </button>
                  )}
                  {user.is_followed && (
                    <span className="text-[10px] text-[#544a33] shrink-0">
                      Following
                    </span>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="px-3 py-3 text-[12px] text-[#544a33] italic text-center">
              No members found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1" />
      <line
        x1="8.5"
        y1="8.5"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
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
