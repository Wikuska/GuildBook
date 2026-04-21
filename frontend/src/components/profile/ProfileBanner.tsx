export function ProfileBanner({ bannerUrl }: { bannerUrl: string | null }) {
  if (!bannerUrl) {
    return (
      <div className="relative h-35 shrink-0 overflow-hidden bg-[#120f09] bg-[repeating-linear-gradient(0deg,transparent,transparent_28px,#1a1408_28px,#1a1408_29px),repeating-linear-gradient(90deg,transparent,transparent_28px,#1a1408_28px,#1a1408_29px)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[repeating-linear-gradient(90deg,var(--color-border-accent)_0px,var(--color-border-accent)_8px,transparent_8px,transparent_16px)]">
        <div className="absolute inset-0 bg-linear-to-br from-[#1e180e33] via-transparent to-[#c9a84c0a] via-60%"></div>
        <svg
          className="absolute left-15 top-5 h-20 w-20 opacity-10"
          viewBox="0 0 80 80"
          fill="none"
        >
          <polygon
            points="40,4 50,20 68,20 68,36 76,48 68,60 50,64 40,76 30,64 12,60 4,48 12,36 12,20 30,20"
            stroke="#c9a84c"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M40 18L44 30L56 30L46 38L50 50L40 42L30 50L34 38L24 30L36 30Z"
            stroke="#c9a84c"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
        <svg
          className="absolute right-20 top-7.5 h-15 w-15 opacity-10"
          viewBox="0 0 60 60"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="40"
            height="40"
            stroke="#c9a84c"
            strokeWidth="0.8"
            fill="none"
            transform="rotate(45 30 30)"
          />
          <circle
            cx="30"
            cy="30"
            r="8"
            stroke="#c9a84c"
            strokeWidth="0.8"
            fill="none"
          />
          <line
            x1="30"
            y1="2"
            x2="30"
            y2="58"
            stroke="#c9a84c"
            strokeWidth="0.5"
          />
          <line
            x1="2"
            y1="30"
            x2="58"
            y2="30"
            stroke="#c9a84c"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative h-35 shrink-0 overflow-hidden">
      <img
        src={bannerUrl}
        alt="Profile Banner"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-br from-[#1e180e33] via-transparent to-[#c9a84c0a] via-60%"></div>
    </div>
  );
}
