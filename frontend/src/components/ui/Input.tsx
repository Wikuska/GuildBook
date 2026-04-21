import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn("mb-4", containerClassName)}>
      {label && (
        <label className="block mb-1.5 text-[11px] uppercase tracking-[1.5px] text-text-mid">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full rounded border border-border-base bg-bg-input px-3 py-2.5 text-[14px] text-parchment outline-none transition-colors duration-150 placeholder:text-text-dim focus:border-gold",
          className,
          error ? "border-red-500" : "",
        )}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
