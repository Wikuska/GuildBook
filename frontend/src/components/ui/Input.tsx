import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input({ label, error, ...props}: InputProps) {
    return (
    <div className="mb-4">
      <label className="block mb-1.5 text-[11px] uppercase tracking-[1.5px] text-[#6b5e42]">
        {label}
      </label>
      <input
        className="w-full rounded border border-[#2a2520] bg-[#0a0906] px-3 py-2.5 text-[14px] text-[#d4c4a0] outline-none transition-colors duration-150 placeholder:text-[#3d3428] focus:border-[#c9a84c]"
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}