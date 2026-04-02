import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input({ label, error, ...props}: InputProps) {
    return (
    <div className="mb-4">
      <label className="block mb-1.5 text-[11px] uppercase tracking-[1.5px] text-sage">
        {label}
      </label>
      <input
        className="w-full rounded border border-border-base bg-bg-input px-3 py-2.5 text-[14px] text-parchment outline-none transition-colors duration-150 placeholder:text-text-dim focus:border-gold"
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}