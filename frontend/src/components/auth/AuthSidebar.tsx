export function AuthSidebar() {
  return (
    <div className="relative hidden w-[45%] flex-col items-center justify-center border-r-[0.5px] border-border-base bg-bg-mid px-8 py-12 md:flex">
      
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 top-3 rounded-md border-[0.5px] border-border-base"></div>
        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-gold"></div>
        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-gold"></div>
        <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold"></div>
        <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold"></div>

        <svg className="mb-6 h-20 w-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40,6 52,18 68,18 68,34 74,46 68,58 52,62 40,74 28,62 12,58 6,46 12,34 12,18 28,18" className="stroke-gold" strokeWidth="1" fill="none"/>
          <polygon points="40,14 50,24 62,24 62,36 67,46 62,56 50,59 40,66 30,59 18,56 13,46 18,36 18,24 30,24" className="stroke-border-base" strokeWidth="0.5" fill="none"/>
          <path d="M40 22 L44 32 L55 32 L46 39 L49 50 L40 43 L31 50 L34 39 L25 32 L36 32 Z" className="stroke-gold fill-bg-surface" strokeWidth="1"/>
          <circle cx="40" cy="38" r="5" className="stroke-gold" strokeWidth="0.5" fill="none"/>
          <line x1="40" y1="15" x2="40" y2="22" className="stroke-gold" strokeWidth="0.5"/>
          <line x1="40" y1="54" x2="40" y2="61" className="stroke-gold" strokeWidth="0.5"/>
          <line x1="15" y1="38" x2="22" y2="38" className="stroke-gold" strokeWidth="0.5"/>
          <line x1="58" y1="38" x2="65" y2="38" className="stroke-gold" strokeWidth="0.5"/>
        </svg>

        <div className="mb-2 text-[28px] font-medium uppercase tracking-[3px] text-gold">GuildBook</div>
        <div className="mb-10 text-[12px] uppercase tracking-[2px] text-sage">Brotherhood of the Continent</div>

        <div className="mb-8 flex w-full items-center gap-2">
          <div className="h-[0.5px] flex-1 bg-border-base"></div>
          <div className="h-1.5 w-1.5 rotate-45 bg-gold"></div>
          <div className="h-[0.5px] flex-1 bg-border-base"></div>
        </div>

        <div className="max-w-60 text-center text-[13px] italic leading-[1.8] text-sage">
          "In these scrolls are recorded the deeds, contracts, and whispers of all who walk the Continent."
        </div>
      
    </div>
  );
}