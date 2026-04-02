import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="mt-1 w-full rounded border-[0.5px] border-gold bg-bg-surface p-3 text-[13px] uppercase tracking-[2px] text-gold transition-colors duration-150 hover:bg-bg-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}