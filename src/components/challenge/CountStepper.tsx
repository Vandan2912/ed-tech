import { Minus, Plus } from "lucide-react";

const circleBtn =
  "flex items-center justify-center size-8 rounded-full border border-[#e8e8e8] bg-white text-[#777] transition hover:border-[var(--auth-primary)] hover:text-[var(--auth-primary)] disabled:opacity-40 disabled:pointer-events-none";

/** − value + control used on the Quiz Overview screen. */
export function CountStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        className={circleBtn}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}>
        <Minus size={12} strokeWidth={3} />
      </button>
      <span className="min-w-9 text-center text-[15px] font-semibold text-[#101828]">
        {value}
        {suffix && (
          <span className="ml-0.5 text-[12px] font-medium text-[#8e8e8e]">
            {suffix}
          </span>
        )}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        className={circleBtn}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}>
        <Plus size={12} strokeWidth={3} />
      </button>
    </div>
  );
}
