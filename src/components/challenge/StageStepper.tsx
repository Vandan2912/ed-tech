import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, STAGE_ORDER } from "./stages";

type StepState = "done" | "current" | "pending";

/**
 * Easy → Medium → Hard progress (Figma "Progression Stepper").
 * `currentIndex` is the stage in progress; pass 3 when every stage is cleared.
 */
export function StageStepper({
  currentIndex,
  className,
}: {
  currentIndex: number;
  className?: string;
}) {
  const stateOf = (i: number): StepState =>
    i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {STAGE_ORDER.map((difficulty, i) => {
        const state = stateOf(i);
        return (
          <Fragment key={difficulty}>
            {i > 0 && (
              <span
                className={cn(
                  "h-0.5 w-6 sm:w-16 shrink-0 rounded-full",
                  stateOf(i - 1) === "done"
                    ? "bg-[#1fc16b]"
                    : stateOf(i - 1) === "current"
                      ? "bg-[#139ced]"
                      : "bg-[#e8e8e8]",
                )}
              />
            )}
            <span className="flex items-center gap-2 shrink-0">
              {state === "done" && (
                <span className="flex items-center justify-center size-6 rounded-full bg-[#1fc16b]">
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              )}
              {state === "current" && (
                <span className="flex size-8 rounded-full border border-[#139ced] p-[3px]">
                  <span className="flex flex-1 items-center justify-center rounded-full bg-[#139ced]">
                    <span className="size-2.5 rounded-full bg-white" />
                  </span>
                </span>
              )}
              {state === "pending" && (
                <span className="size-6 rounded-full bg-[#e8e8e8]" />
              )}
              <span
                className={cn(
                  "text-[13px] sm:text-[14px] whitespace-nowrap",
                  state === "done" && "font-bold text-[#1fc16b]",
                  state === "current" && "font-bold text-[#139ced]",
                  state === "pending" && "font-semibold text-[#777]",
                )}>
                {STAGE_LABEL[difficulty]}
              </span>
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}
