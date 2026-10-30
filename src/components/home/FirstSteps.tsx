import { cn } from "@/lib/utils";

const STEPS = [
  {
    reward: "+50 pts",
    title: "Take the 10-minute diagnostic",
    description: `20 quick questions. We draw your first "Where I stand" map.`,
  },
  {
    reward: "+20 pts · Rookie badge",
    title: "Clear the Easy stage of one topic",
    description: "Pick any topic, or one we suggest from your diagnostic.",
  },
  {
    reward: "+30 pts · 🔥 streak",
    title: "Practise 3 days in a row",
    description: "Even 10 minutes a day starts your streak.",
  },
];

/** "Your first 3 steps" for Level 0 learners (Figma 2094:11081). Only step 1 is unlocked. */
export function FirstSteps({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[24px] leading-8 font-bold text-[#101828]">
          Your first 3 steps
        </h2>
        <p className="text-[14px] leading-5 text-[#6b7280]">
          Do these this week and you will reach Level 1.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((step, i) => {
          const unlocked = i === 0;
          return (
            <div
              key={step.title}
              className={cn(
                "flex flex-col gap-3 p-5 bg-white rounded-2xl shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]",
                !unlocked && "border border-[#f3f4f6]",
              )}>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "flex items-center justify-center size-[34px] shrink-0 rounded-full text-[14px] leading-5 font-bold",
                    unlocked
                      ? "bg-[rgba(19,156,237,0.12)] text-[var(--auth-primary-dark-1)]"
                      : "bg-[rgba(156,163,175,0.12)] text-[#99a1af]",
                  )}>
                  {i + 1}
                </span>
                <span className="px-3 py-1 rounded-full bg-[rgba(31,193,107,0.12)] text-[12px] leading-4 font-semibold text-[#15803d] whitespace-nowrap">
                  {step.reward}
                </span>
              </div>
              <h3
                className={cn(
                  "text-[16px] leading-6 font-bold",
                  unlocked ? "text-[#101828]" : "text-[#4a5565]",
                )}>
                {step.title}
              </h3>
              <p className="text-[13px] leading-[18px] text-[#6b7280]">
                {step.description}
              </p>
              {unlocked ? (
                <button
                  type="button"
                  onClick={onStart}
                  className="w-full px-5 py-3 rounded-xl bg-[var(--auth-primary)] text-[14px] leading-5 font-semibold text-white transition active:scale-[0.98]">
                  Start now
                </button>
              ) : (
                <p className="text-[12px] leading-4 font-semibold text-[#99a1af]">
                  🔒 Locked until step 1
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
