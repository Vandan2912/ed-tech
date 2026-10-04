import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMyBest, type MyBestData } from "@/api/ranks";
import { getLevelCountdown } from "@/lib/localProfile";

const TOTAL_LEVELS = 20;

// Backend has no per-level history endpoint — the arithmetic step Figma uses
// (100, 150, 200, ... +50/level) approximates every level except the current
// one, which uses the real value from getMyBest().
function pointsRequiredFor(level: number) {
  return 50 * (level + 1);
}

export function LevelProgressCard() {
  const [best, setBest] = useState<MyBestData | null>(null);

  useEffect(() => {
    getMyBest()
      .then(setBest)
      .catch(() => {});
  }, []);

  if (!best) return null;

  const { level: currentLevel, progress } = best;
  const countdown = getLevelCountdown(currentLevel);
  const pointsToGo = Math.max(0, progress.required - progress.current);
  const countdownLabel = countdown.expired
    ? "Time's up"
    : `${countdown.days}d ${countdown.hours}h left`;

  // Mobile shows the last two passed levels next to the current one.
  const firstMobileLevel = Math.max(1, currentLevel - 2);
  const mobileLevels = Array.from(
    { length: currentLevel - firstMobileLevel + 1 },
    (_, i) => firstMobileLevel + i,
  );

  return (
    <>
      <div className="sm:hidden flex flex-col gap-4 p-4 bg-white border border-[#f3f4f6] rounded-[20px] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="text-[14px] font-bold text-[#1e2939]">
              Level Progress
            </h3>
            <p className="text-[11px] text-[#99a1af]">
              Complete within 3 days or restart
            </p>
          </div>
          <span className="px-2 py-1 rounded-full bg-[var(--auth-primary)] text-[10px] font-bold text-white whitespace-nowrap">
            Lvl {currentLevel} Active
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-[#233ae8]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-white">
              Level {currentLevel} Challenge
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#ffdb43] whitespace-nowrap">
              <Clock size={10} />
              {countdownLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#eef2ff]">
              {progress.current} pts earned · {pointsToGo} pts to go
            </span>
            <span className="text-[13px] font-bold text-[#1fc16b]">
              {progress.percent}%
            </span>
          </div>
          <div className="h-1.5 rounded-[3px] bg-white/16 overflow-hidden">
            <div
              className="h-full rounded-[3px] bg-[#1fc16b]"
              style={{ width: `${Math.min(100, progress.percent)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 text-[11px]">
          {mobileLevels.map((level) =>
            level < currentLevel ? (
              <div
                key={level}
                className="flex flex-col gap-1 w-[100px] shrink-0 p-2.5 rounded-[10px] bg-[#f3fbff] border border-[#d9f1ff] text-[var(--auth-primary)]">
                <span className="font-bold">Level {level}</span>
                <span className="font-semibold">Passed ✓</span>
              </div>
            ) : (
              <div
                key={level}
                className="flex flex-col gap-1 flex-1 min-w-0 p-2.5 rounded-[10px] bg-[#233ae8]">
                <span className="font-bold text-white">Level {level}</span>
                <span className="font-semibold text-[#ffdb43]">
                  {progress.current} / {progress.required}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="hidden sm:block bg-white border border-[#f3f4f6] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
          <div>
            <h3 className="text-[13px] font-bold text-[#101828]">
              Level Progress
            </h3>
            <p className="pt-0.5 text-[14px] font-medium text-[#99a1af]">
              Scroll to see all levels · Complete within 3 days or restart
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[14px] font-medium text-[#99a1af] whitespace-nowrap">
              {currentLevel} of {TOTAL_LEVELS}
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-[var(--auth-primary)] text-[11px] font-semibold text-white whitespace-nowrap">
              Level {currentLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-3 border-b border-[var(--auth-neutral-200)]">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock size={14} className="text-[var(--auth-red-100)]" />
            <span className="text-[14px] font-medium text-[var(--auth-red-100)] whitespace-nowrap">
              {countdown.expired
                ? "Time's up"
                : `${countdown.days}d ${countdown.hours}h remaining`}
            </span>
          </div>
          <span className="w-px h-4 bg-[var(--auth-neutral-300)] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-medium text-[var(--auth-yellow-300)] whitespace-nowrap">
                {progress.current} pts earned · {pointsToGo} pts to go
              </span>
              <span className="text-[14px] font-medium text-[#1fc16b]">
                {progress.percent}%
              </span>
            </div>
            <div className="pt-1 h-1.5 rounded-full bg-[var(--auth-green-alpha-10)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1fc16b]"
                style={{ width: `${Math.min(100, progress.percent)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 overflow-x-auto">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((level) => {
            const isPassed = level < currentLevel;
            const isCurrent = level === currentLevel;
            const required = isCurrent
              ? progress.required
              : pointsRequiredFor(level);
            const earned = isPassed ? required : isCurrent ? progress.current : 0;
            const percent = isPassed ? 100 : isCurrent ? progress.percent : 0;

            return (
              <div
                key={level}
                className={cn(
                  "flex flex-col shrink-0 w-40 rounded-[14px] px-3.5 py-3 border",
                  isCurrent
                    ? "bg-[#6c7cf0] border-[rgba(10,20,95,0.1)]"
                    : isPassed
                      ? "bg-[#f3fbff] border-[#d9f1ff]"
                      : "bg-[#f9fafb]/80 border-[#f3f4f6]",
                )}>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[14px] font-medium",
                      isCurrent
                        ? "text-white"
                        : isPassed
                          ? "text-[var(--auth-primary-dark-2)]"
                          : "text-[#99a1af]",
                    )}>
                    Level {level}
                  </span>
                  {isPassed ? (
                    <CheckCircle2
                      size={14}
                      className="text-[var(--auth-primary-dark-2)]"
                    />
                  ) : isCurrent ? (
                    <Zap size={14} className="text-white" fill="white" />
                  ) : (
                    <Lock size={14} className="text-[#d1d5dc]" />
                  )}
                </div>

                <div className="pt-2.5">
                  <span
                    className={cn(
                      "text-[13px] font-bold",
                      isCurrent
                        ? "text-white"
                        : isPassed
                          ? "text-[var(--auth-primary-dark-2)]"
                          : "text-[#d1d5dc]",
                    )}>
                    {earned}
                  </span>
                  <span
                    className={cn(
                      "text-[8px] font-medium ml-1",
                      isCurrent
                        ? "text-[var(--auth-neutral-300)]"
                        : isPassed
                          ? "text-[var(--auth-primary-dark-2)]"
                          : "text-[#99a1af]",
                    )}>
                    / {required} pts
                  </span>
                  <p
                    className={cn(
                      "pt-0.5 text-[11px] font-medium",
                      isCurrent
                        ? "text-white"
                        : isPassed
                          ? "text-[var(--auth-primary-dark-2)]"
                          : "text-[#d1d5dc]",
                    )}>
                    {isPassed
                      ? "Passed ✓"
                      : isCurrent
                        ? `${required - earned} pts left`
                        : `Need ${required} pts`}
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-1.5 h-1.5 rounded-full overflow-hidden",
                    isCurrent ? "bg-white" : "bg-[#e5e7eb]",
                  )}>
                  <div
                    className={cn(
                      "h-full rounded-full",
                      isCurrent
                        ? "bg-[var(--auth-secondary-light-2)]"
                        : isPassed
                          ? "bg-[var(--auth-primary-dark-2)]"
                          : "bg-[#d1d5dc]",
                    )}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>

                {isCurrent && (
                  <div className="flex items-center gap-1 pt-2">
                    <Clock size={10} className="text-[var(--auth-yellow-100)]" />
                    <span className="text-[14px] font-medium text-[var(--auth-yellow-100)] whitespace-nowrap">
                      {countdown.expired
                        ? "Time's up"
                        : `${countdown.days}d ${countdown.hours}h left`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
