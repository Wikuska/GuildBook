const RACE_COLORS: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Witcher: { color: "#c9a84c", bg: "#1a1408", border: "#c9a84c" },
  Sorcerer: { color: "#7c6a96", bg: "#1a1408", border: "#5b4d73" },
  Dwarf: { color: "#926852", bg: "#1a1408", border: "#6b4c3c" },
  Elf: { color: "#7a8c69", bg: "#1a1408", border: "#5a6b4d" },
  Human: { color: "#8a7a58", bg: "#1a1408", border: "#544a33" },
};

const DEFAULT_RACE_COLORS = {
  color: "#8a7a58",
  bg: "#1a1408",
  border: "#3d3428",
};

interface AvatarProps {
  username?: string;
  raceName?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ username, raceName, size = "md" }: AvatarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : "?";

  const colors =
    raceName && RACE_COLORS[raceName]
      ? RACE_COLORS[raceName]
      : DEFAULT_RACE_COLORS;

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px] border-[1.5px]",
    md: "w-12 h-12 text-[15px] border-2",
    lg: "w-16 h-16 text-[20px] border-2",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded font-medium uppercase tracking-[1px] ${sizeClasses[size]}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.color,
      }}
    >
      {initial}
    </div>
  );
}
