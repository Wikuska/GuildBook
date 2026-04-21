import { cn } from "../../utils";

interface Option {
  id: number;
  name: string;
}

interface MultiSelectProps {
  label?: string;
  values: number[];
  onChange: (values: number[]) => void;
  options: Option[];
  error?: string;
  containerClassName?: string;
  isLoading?: boolean;
}

export function MultiSelect({
  label,
  values,
  onChange,
  options,
  error,
  containerClassName,
  isLoading = false,
}: MultiSelectProps) {
  const toggleOption = (id: number) => {
    onChange(
      values.includes(id) ? values.filter((v) => v !== id) : [...values, id],
    );
  };

  if (isLoading) {
    return (
      <div className={cn("mb-4", containerClassName)}>
        {label && (
          <label className="block text-[11px] mb-1.5 uppercase tracking-[1.5px] text-text-mid">
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {[72, 56, 88, 64].map((w) => (
            <div
              key={w}
              style={{ width: w }}
              className="h-7 rounded-sm bg-bg-surface border border-border-accent animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-4", containerClassName)}>
      {label && (
        <label className="block text-[11px] mb-1.5 uppercase tracking-[1.5px] text-text-mid">
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = values.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={cn(
                "px-3 py-1.5 rounded-sm border text-[11px] uppercase tracking-[1px] transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-gold bg-bg-surface text-gold"
                  : "border-border-accent bg-bg-base text-text-dim hover:border-gold hover:text-gold",
              )}
            >
              {option.name}
            </button>
          );
        })}
        {options.length === 0 && (
          <span className="text-[11px] text-text-dim italic">
            No options found.
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
