import { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { useAuth } from "@/auth/useAuth";
import { UpgradeModal } from "@/components/UpgradeModal";
import { cn } from "@/lib/utils";

const FREE_QUOTA = 3;

export function MostSearchedTopics() {
  const subjects = useAppSelector((state) => state.course.subjects);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (subjects.length === 0) return null;

  const isPremium = !!user?.is_premium;

  return (
    <section className="sm:pt-4">
      <div className="flex flex-col items-start sm:items-center gap-1 sm:gap-2 text-left sm:text-center">
        <h2 className="text-[16px] font-extrabold sm:text-[24px] sm:font-bold text-[#1e2939] sm:text-[var(--auth-neutral-1000)]">
          Most Searched Topics
        </h2>
        <p className="text-[12px] text-[#6b7280] sm:text-[15px] sm:font-semibold sm:text-[var(--auth-neutral-700)]">
          Based on your curriculum
        </p>
      </div>

      <div className="pt-3 sm:pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {subjects.slice(0, 8).map((subject, i) => {
          const locked = !isPremium && i >= FREE_QUOTA;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() =>
                locked
                  ? setUpgradeOpen(true)
                  : navigate(`/courses/${subject.id}`)
              }
              className={cn(
                "relative text-left flex flex-col gap-1.5 sm:gap-2.5 sm:h-[124px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#f3f4f6] bg-white overflow-hidden sm:shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]",
                locked && "max-sm:opacity-60",
              )}>
              <span className="flex items-center justify-between gap-1">
                <span
                  className={cn(
                    "text-[13px] sm:text-[14px] font-bold",
                    locked
                      ? "text-[#1e2939] sm:text-[#6b7280]"
                      : "text-[#1e2939] sm:text-[var(--auth-neutral-1000)]",
                  )}>
                  {subject.name}
                </span>
                {locked && (
                  <Lock size={10} className="sm:hidden shrink-0 text-[#6b7280]" />
                )}
              </span>
              <span className="text-[11px] sm:font-medium text-[#6b7280]">
                {subject.topics?.length ?? 0} topics to explore
              </span>

              {locked && (
                <span className="hidden sm:contents">
                  <span className="absolute inset-[-1px] backdrop-blur-[3px] bg-gradient-to-b from-white/0 via-white/80 to-white/95" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-[var(--auth-primary-dark-3)] to-[var(--auth-secondary-light-2)] shadow-[0px_6px_8px_rgba(99,102,241,0.2)] whitespace-nowrap">
                    <Lock size={14} className="text-white" />
                    <span className="text-[11px] font-bold text-white">
                      Upgrade to PRO
                    </span>
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </section>
  );
}
