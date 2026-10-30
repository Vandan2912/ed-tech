import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { getDailyGoal, setDailyGoal } from "@/lib/dailyGoal";

const MIN_GOAL = 1;
const MAX_GOAL = 200;

/** "Change daily goal" dialog (Figma 2186:12014). */
export function DailyGoalModal({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (goal: number) => void;
}) {
  const [value, setValue] = useState("");
  const goal = Number(value);
  const valid = Number.isInteger(goal) && goal >= MIN_GOAL && goal <= MAX_GOAL;

  const save = () => {
    if (!valid) return;
    setDailyGoal(goal);
    onSaved(goal);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (next) setValue(String(getDailyGoal()));
        onOpenChange(next);
      }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-900/60 supports-backdrop-filter:backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] p-6 flex flex-col gap-4 duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-[18px] leading-[26px] font-bold text-[#101828]">
              Change daily goal
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-[#4a5565] focus-visible:outline-none">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="text-[14px] leading-5 text-[#4a5565]">
            Set how many questions you practise each day.
          </DialogPrimitive.Description>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] leading-4 font-semibold text-[#4a5565]">
                Daily question goal
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={MIN_GOAL}
                max={MAX_GOAL}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f7f9fc] text-[14px] leading-5 font-bold text-[#101828] focus:outline-none focus:ring-2 focus:ring-[var(--auth-primary)]/40"
              />
              <span className="text-[12px] leading-4 text-[#6b7280]">
                Questions per day
              </span>
            </label>

            <div className="flex justify-end gap-3">
              <DialogPrimitive.Close className="px-5 py-2.5 rounded-xl border-[1.5px] border-[rgba(51,51,51,0.12)] bg-white text-[14px] leading-5 font-semibold text-[#101828]">
                Cancel
              </DialogPrimitive.Close>
              <button
                type="submit"
                disabled={!valid}
                className="px-5 py-2.5 rounded-xl bg-[var(--auth-primary)] text-[14px] leading-5 font-semibold text-white disabled:opacity-50">
                Save goal
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
