import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X, XCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getLocalGoalProfile,
  setLocalGoalProfile,
  type LocalGoalProfile,
} from "@/lib/localProfile";

const GOAL_SUGGESTIONS = [
  { title: "NEET Prep", description: "Crack the medical entrance exam" },
  { title: "JEE Prep", description: "Ace the engineering entrance" },
  { title: "UPSC Prep", description: "Clear the civil services exam" },
  { title: "Board Exams", description: "Score high in 10th/12th boards" },
  { title: "CAT Prep", description: "Get into top MBA colleges" },
  { title: "Gate Prep", description: "Master the graduate aptitude test" },
];

export function UpdateGoalModal({
  open,
  onOpenChange,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (profile: LocalGoalProfile) => void;
}) {
  const [goal, setGoal] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");

  const hydrate = () => {
    const profile = getLocalGoalProfile();
    setGoal(profile.goal);
    setSubjects(profile.subjects);
  };

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed || subjects.includes(trimmed)) return;
    setSubjects((prev) => [...prev, trimmed]);
    setNewSubject("");
  };

  const removeSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((s) => s !== subject));
  };

  const handleUpdate = () => {
    const profile = { goal, subjects };
    setLocalGoalProfile(profile);
    onUpdated(profile);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (next) hydrate();
        onOpenChange(next);
      }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-900/60 supports-backdrop-filter:backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white border border-[#e5e7eb] rounded-2xl p-7 flex flex-col gap-6 duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-[18px] font-bold text-[#1f2937]">
              Update Your Goal &amp; Subjects
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="text-[#333] focus-visible:outline-none">
              <X size={16} />
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[13px] font-bold text-[var(--auth-neutral-1000)]">
              Your Goal
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-[var(--auth-neutral-700)]">
                Describe &amp; Update your learning goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11 w-full px-4 rounded-[10px] border-[1.5px] border-[#e5e7eb] text-[13px] text-[#1f2937] focus:outline-none focus:border-[var(--auth-primary)]"
              />
              <p className="text-[12px] text-[#6b7280]">
                Tell us what you want to achieve so we can personalize your
                experience.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-[var(--auth-neutral-700)]">
                Suggested goals
              </p>
              <div className="grid grid-cols-2 gap-3">
                {GOAL_SUGGESTIONS.map((s) => {
                  const selected = goal === s.title;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setGoal(s.title)}
                      className={cn(
                        "flex flex-col gap-1.5 items-start text-left p-3 rounded-xl border",
                        selected
                          ? "bg-[var(--auth-primary-alpha-10)] border-transparent"
                          : "bg-white border-[var(--auth-neutral-alpha-04,rgba(51,51,51,0.04))]",
                      )}>
                      <span className="text-[14px] font-semibold text-[#1f2937]">
                        {s.title}
                      </span>
                      <span className="text-[12px] text-[#6b7280]">
                        {s.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-bold text-[var(--auth-neutral-1000)]">
              Your Selected Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <span
                  key={subject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--auth-primary-alpha-10)]">
                  <span className="text-[13px] font-semibold text-[var(--auth-primary-dark-2)]">
                    {subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="focus-visible:outline-none">
                    <XCircle
                      size={10}
                      className="text-[var(--auth-primary-dark-2)]"
                    />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] font-bold text-[var(--auth-neutral-1000)]">
              Add New Subject
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Add a new subject..."
                className="flex-1 h-[42px] px-4 rounded-lg border-[1.5px] border-[#e5e7eb] text-[14px] text-[#1f2937] placeholder:text-[#6b7280] focus:outline-none focus:border-[var(--auth-primary)]"
              />
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center justify-center size-[42px] rounded-lg bg-[var(--auth-primary)] shrink-0 focus-visible:outline-none">
                <Plus size={16} className="text-white" />
              </button>
            </div>
          </div>

          <div className="h-px w-full bg-[#e5e7eb]" />

          <button
            type="button"
            onClick={handleUpdate}
            className="h-12 w-full rounded-[10px] bg-[var(--auth-primary)] text-[15px] font-bold text-white">
            Update
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
