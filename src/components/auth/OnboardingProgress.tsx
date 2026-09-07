import { motion } from "motion/react";

/** Animated top progress bar, clipped to the card's rounded corners. */
export function OnboardingProgressBar({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const pct = Math.min(100, (step / totalSteps) * 100);

  return (
    <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[24px] sm:rounded-t-[40px] overflow-hidden bg-[#e8e8e8] z-20">
      <motion.div
        className="h-full bg-[#3eaef0]"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

export function StepBadge({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  return (
    <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1 bg-[#3eaef0]/10 rounded-full text-[11px] font-bold text-[#0f80c3] uppercase tracking-widest">
      Step {step} of {totalSteps}
    </div>
  );
}
