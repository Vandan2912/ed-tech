import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyBestData } from "@/api/ranks";
import { LevelProgressCard } from "./LevelProgressCard";

/** Collapsed one-line level progress; "View levels" expands the full level list. */
export function LevelProgressBar({ best }: { best: MyBestData }) {
  const [open, setOpen] = useState(false);
  const percent = Math.min(100, Math.max(0, best.progress.percent));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 px-4 sm:px-6 py-3 sm:py-4 bg-white border border-[#f3f4f6] rounded-2xl shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]">
        <span className="px-3 py-1 rounded-full bg-[var(--auth-primary)] text-[12px] leading-4 font-semibold text-white whitespace-nowrap">
          Level {best.level}
        </span>
        <p className="text-[13px] leading-[18px] font-medium text-[#4a5565] sm:whitespace-nowrap">
          {percent}% of the way to Level {best.level + 1} ·{" "}
          {best.totalXp.toLocaleString()} pts
        </p>
        <div className="order-last sm:order-none basis-full sm:basis-auto flex-1 h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--auth-primary)]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="ml-auto sm:ml-0 flex items-center gap-1 px-1 py-3 rounded-xl text-[14px] leading-5 font-semibold text-[var(--auth-primary-dark-1)] whitespace-nowrap">
          View levels
          <ChevronDown
            size={14}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      {open && <LevelProgressCard />}
    </div>
  );
}
