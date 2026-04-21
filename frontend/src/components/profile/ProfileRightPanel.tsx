function SidebarSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] text-text-dim before:h-1 before:w-1 before:shrink-0 before:rotate-45 before:bg-sage">
      {children}
    </div>
  );
}

export function ProfileRightPanel() {
  return (
    <div className="flex w-50 min-w-50 flex-col gap-6 border-l border-border-base px-4 py-5">
      <div>
        <SidebarSectionTitle>Medallions</SidebarSectionTitle>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 rounded-sm border border-border-accent bg-bg-surface px-2 py-1.5">
            <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-sm border border-gold bg-[#1e180e]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1l1.5 4h4l-3.5 2.5 1.5 4L7 9 3.5 11.5 5 7.5 1.5 5h4z"
                  stroke="#c9a84c"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
            <span className="flex-1 text-[11px] text-text-mid">
              Master Slayer
            </span>
            <span className="text-[10px] text-text-dim">1260</span>
          </div>

          <div className="flex items-center gap-2 rounded-sm border border-border-accent bg-bg-surface px-2 py-1.5">
            <div className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-sm border border-[#3d6b42] bg-[#0e1a14]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="#3d6b42"
                  strokeWidth="0.8"
                />
                <path d="M5 7l2 2 3-3" stroke="#3d6b42" strokeWidth="1" />
              </svg>
            </div>
            <span className="flex-1 text-[11px] text-text-mid">
              Contract Elder
            </span>
            <span className="text-[10px] text-text-dim">1258</span>
          </div>
        </div>
      </div>

      <div>
        <SidebarSectionTitle>Affiliations</SidebarSectionTitle>
        <div className="flex flex-col gap-1">
          {[
            "School of the Wolf",
            "Witchers Guild",
            "Kaer Morhen Brotherhood",
          ].map((affil, i) => (
            <div
              key={affil}
              className="flex items-center gap-1.5 border-b border-border-base py-1 pl-1 text-xs text-text-mid last:border-none"
            >
              <div
                className={`h-1.25 w-1.25 shrink-0 rotate-45 ${i === 0 ? "bg-gold" : "bg-border-accent"}`}
              ></div>
              {affil}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
