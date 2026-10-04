import { useState } from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";
import { useAuth } from "@/auth/useAuth";
import { UpgradeModal } from "@/components/UpgradeModal";

const FREE_QUOTA = 3;

export function MostSearchedTopics() {
  const subjects = useAppSelector((state) => state.course.subjects);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (subjects.length === 0) return null;

  const isPremium = !!user?.is_premium;

  return (
    <section className="pt-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-[24px] font-bold text-[var(--auth-neutral-1000)]">
          Most Searched Topics
        </h2>
        <p className="text-[15px] font-semibold text-[var(--auth-neutral-700)]">
          Based on your curriculum
        </p>
      </div>

      <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
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
              className="relative text-left flex flex-col gap-2.5 h-[124px] p-4 rounded-2xl border border-[#f3f4f6] bg-white overflow-hidden shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
              <span
                className={
                  locked
                    ? "text-[14px] font-bold text-[#6b7280]"
                    : "text-[14px] font-bold text-[var(--auth-neutral-1000)]"
                }>
                {subject.name}
              </span>
              <span className="text-[11px] font-medium text-[#6b7280]">
                {subject.topics?.length ?? 0} topics to explore
              </span>

              {locked && (
                <>
                  <span className="absolute inset-[-1px] backdrop-blur-[3px] bg-gradient-to-b from-white/0 via-white/80 to-white/95" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-[var(--auth-primary-dark-3)] to-[var(--auth-secondary-light-2)] shadow-[0px_6px_8px_rgba(99,102,241,0.2)] whitespace-nowrap">
                    <Lock size={14} className="text-white" />
                    <span className="text-[11px] font-bold text-white">
                      Upgrade to PRO
                    </span>
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </section>
  );
}
