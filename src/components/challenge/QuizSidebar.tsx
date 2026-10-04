import { cn } from "@/lib/utils";

export type NavStatus =
  | "correct"
  | "wrong"
  | "answered" // submitted, correctness unknown
  | "skipped"
  | "current"
  | "upcoming";

const card =
  "w-full bg-white border border-[#f3f4f6] rounded-2xl p-5 drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]";

export function PerformanceCard({ points }: { points: number }) {
  return (
    <div className={card}>
      <p className="text-[12px] font-bold text-[#101010]">
        Current Performance
      </p>
      <p className="flex items-baseline gap-1 pt-1">
        <span className="text-[32px] font-extrabold text-[#6c7cf0]">
          +{points} pts
        </span>
        <span className="text-[14px] text-[#8e8e8e]">earned</span>
      </p>
    </div>
  );
}

export function QuestionNavigator({ statuses }: { statuses: NavStatus[] }) {
  return (
    <div className={cn(card, "flex flex-col gap-4")}>
      <p className="text-[12px] font-bold text-[#101010]">
        Question Navigator
      </p>
      <ol className="grid grid-cols-5 gap-2 w-fit">
        {statuses.map((status, i) => (
          <li
            key={i}
            aria-current={status === "current" ? "step" : undefined}
            className={cn(
              "flex items-center justify-center size-11 rounded-full text-[13px] font-bold",
              status === "correct" && "bg-[#1fc16b] text-white",
              status === "wrong" && "bg-[#fb3748] text-white",
              status === "current" && "bg-[var(--auth-primary)] text-white",
              status === "answered" &&
                "bg-[#cfebfb] text-[var(--auth-primary-dark-2)]",
              status === "skipped" &&
                "bg-[#f3f4f6] text-[#8e8e8e] border border-dashed border-[#d2d2d2]",
              status === "upcoming" &&
                "bg-white border border-[#d2d2d2] text-[#8e8e8e]",
            )}>
            {i + 1}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#8e8e8e]">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-[3px] bg-[#1fc16b]" />
          Correctly Answered
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-[3px] bg-[#fb3748]" />
          Wrong Answer
        </span>
      </div>
    </div>
  );
}

export function SidebarButton({
  variant,
  children,
  onClick,
  disabled,
}: {
  variant: "exit" | "break";
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center w-full rounded-lg font-semibold transition disabled:opacity-50",
        variant === "exit" &&
          "p-4 bg-[#fb3748]/10 text-[13px] text-[#fb3748] hover:bg-[#fb3748]/15",
        variant === "break" &&
          "h-10 bg-[#333]/[0.04] border border-[#cfebfb] text-[12px] text-[var(--auth-primary-dark-2)] hover:bg-[#cfebfb]/40",
      )}>
      {children}
    </button>
  );
}
