import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="mt-1 w-full rounded border-[0.5px] border-[#c9a84c] bg-[#1e180e] p-3 text-[13px] uppercase tracking-[2px] text-[#c9a84c] transition-colors duration-150 hover:bg-[#2a2010]"
      {...props}
    >
      {children}
    </button>
  );
}