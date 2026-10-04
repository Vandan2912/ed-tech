import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type OptionState =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "neutral"; // revealed, neither picked nor correct

const BADGE_LETTERS = "ABCDEFGH";

/**
 * One answer choice. Before submit it's a selectable card (Figma 1669:3182);
 * after submit it becomes a result bar with an optional % fill (Figma 1669:3031).
 */
export function OptionRow({
  index,
  text,
  state,
  percent,
  disabled,
  onSelect,
}: {
  index: number;
  text: string;
  state: OptionState;
  percent?: number;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const letter = BADGE_LETTERS[index] ?? String(index + 1);
  const revealed =
    state === "correct" || state === "wrong" || state === "neutral";

  if (revealed) {
    const tone = {
      correct: {
        bg: "bg-[#1fc16b]/10",
        fill: "bg-[#1fc16b]/10",
        badge: "bg-[#22c55e] text-white",
        text: "font-semibold text-[#16a34a]",
        pct: "font-bold text-[#16a34a]",
      },
      wrong: {
        bg: "bg-[#fb3748]/10",
        fill: "bg-[#fb3748]/10",
        badge: "bg-[#ef4444] text-white",
        text: "font-semibold text-[#dc2626]",
        pct: "font-bold text-[#dc2626]",
      },
      neutral: {
        bg: "bg-[#333]/[0.04]",
        fill: "bg-[#333]/[0.04]",
        badge: "bg-[#d1d5db] text-[#6b7280]",
        text: "font-medium text-[#4a4a4a]",
        pct: "font-semibold text-[#6b7280]",
      },
    }[state];

    return (
      <div
        className={cn(
          "relative flex items-center gap-3 min-h-14 w-full overflow-hidden rounded-lg pl-3 pr-4 py-2.5",
          tone.bg,
        )}>
        {percent !== undefined && (
          <span
            className={cn("absolute inset-y-0 left-0 rounded-lg", tone.fill)}
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        )}
        <span
          className={cn(
            "relative flex items-center justify-center size-[22px] shrink-0 rounded-full text-[9px] font-bold",
            tone.badge,
          )}>
          {letter}
        </span>
        <span className={cn("relative flex-1 min-w-0 text-[15px]", tone.text)}>
          {text}
        </span>
        {percent !== undefined && (
          <span className={cn("relative text-[15px] shrink-0", tone.pct)}>
            {Math.round(percent)}%
          </span>
        )}
      </div>
    );
  }

  const selected = state === "selected";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 w-full p-4 rounded-xl text-left transition-colors disabled:cursor-not-allowed",
        selected
          ? "bg-[#cfebfb] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]"
          : "bg-white border border-[#e5e7eb] hover:border-[var(--auth-primary)]/50",
      )}>
      <span
        className={cn(
          "flex items-center justify-center size-[22px] shrink-0 rounded-full border-[0.5px] text-[9px] font-bold",
          selected
            ? "border-[var(--auth-primary)] text-[var(--auth-primary)]"
            : "bg-white border-[#d2d2d2] text-[#8e8e8e]",
        )}>
        {letter}
      </span>
      <span
        className={cn(
          "flex-1 min-w-0 text-[15px]",
          selected
            ? "font-semibold text-[var(--auth-primary-dark-2)]"
            : "font-medium text-[#4a4a4a]",
        )}>
        {text}
      </span>
      <span
        className={cn(
          "flex items-center justify-center size-5 shrink-0 rounded",
          selected
            ? "bg-[var(--auth-primary)]"
            : "border border-[#d1d1d6] bg-white",
        )}>
        {selected && <Check size={14} strokeWidth={3} className="text-white" />}
      </span>
    </button>
  );
}
