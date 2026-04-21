import { useState } from "react";
import { cn } from "../../utils";

interface Option {
  id: number;
  name: string;
}

interface SelectProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  containerClassName?: string;
  isLoading?: boolean;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  error,
  containerClassName,
  isLoading = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.id === value);

  if (isLoading) {
    return (
      <div className={cn("mb-4", containerClassName)}>
        {label && (
          <label className="block text-[11px] mb-1.5 uppercase tracking-[1.5px] text-text-mid">
            {label}
          </label>
        )}
        <div className="h-10 w-full rounded-sm bg-bg-surface border border-border-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn("relative mb-4", containerClassName)}>
      {label && (
        <label className="block mb-1.5 text-[11px] uppercase tracking-[1.5px] text-text-mid">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded border bg-bg-base px-3 py-2.5 text-[14px] outline-none transition-colors duration-150",
          isOpen ? "border-gold" : "border-border-accent",
          error ? "border-red-500" : "",
        )}
      >
        <span className={selectedOption ? "text-text-mid" : "text-text-dim"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <span className="text-[10px] text-text-dim">{isOpen ? "▲" : "▼"}</span>
      </button>

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-sm border border-border-accent bg-bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            {options.length === 0 ? (
              <li className="px-3 py-2 text-[12px] text-text-dim text-center">
                No options available
              </li>
            ) : (
              options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer px-3 py-2.5 text-[13px] transition-colors",
                    value === option.id
                      ? "bg-bg-hover text-gold border-l-2 border-gold"
                      : "text-text-mid hover:bg-bg-hover hover:text-text-mid border-l-2 border-transparent",
                  )}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
