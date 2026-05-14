import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "danger" | "subtle";
}

const variants = {
  default:
    "rounded border-[0.5px] border-gold text-gold bg-bg-surface hover:bg-bg-hover",
  danger:
    "rounded border-[0.5px] border-red-900/50 text-red-400 hover:bg-red-900/20",
  subtle:
    "rounded border-[0.5px] border-border-accent text-text-mid hover:border-gold hover:text-gold",
};

export function Button({
  children,
  className,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "p-3 text-[13px] uppercase tracking-[2px] transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant && variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
