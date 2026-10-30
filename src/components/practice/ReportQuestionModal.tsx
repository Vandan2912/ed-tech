import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Flag, X } from "lucide-react";
import { toast } from "sonner";
import { reportQuestion, type ReportReason } from "@/api/quizzes";
import { cn, getApiErrorMessage } from "@/lib/utils";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "incorrect", label: "Incorrect question or answer" },
  { value: "unclear", label: "Unclear wording or typo" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "other", label: "Something else" },
];

const MAX_DETAILS = 300;

/** "Report this question" dialog (Figma 2174:917). */
export function ReportQuestionModal({
  questionId,
  open,
  onOpenChange,
}: {
  questionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState<ReportReason>("incorrect");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await reportQuestion(questionId, {
        reason,
        details: details.trim() || undefined,
      });
      toast.success("Thanks — we'll review this question.");
      onOpenChange(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't send your report."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setReason("incorrect");
          setDetails("");
        }
        onOpenChange(next);
      }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-900/60 supports-backdrop-filter:backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[472px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] p-6 flex flex-col gap-4 duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="flex items-center gap-3 text-[18px] leading-[26px] font-bold text-[#101828]">
              <Flag size={22} strokeWidth={1.75} /> Report this question
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-[#4a5565] focus-visible:outline-none">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="text-[14px] leading-5 text-[#4a5565]">
            Help us improve this question. What seems wrong?
          </DialogPrimitive.Description>

          <fieldset className="flex flex-col gap-3">
            <legend className="pb-3 text-[12px] leading-4 font-semibold text-[#4a5565]">
              Reason for reporting
            </legend>
            {REASONS.map((r) => (
              <label
                key={r.value}
                className="flex items-center gap-2.5 cursor-pointer text-[14px] leading-5 text-[#101828]">
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex items-center justify-center size-[18px] rounded-full border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--auth-primary)]/40",
                    reason === r.value
                      ? "border-[var(--auth-primary)]"
                      : "border-[#d2d5db]",
                  )}>
                  {reason === r.value && (
                    <span className="size-2.5 rounded-full bg-[var(--auth-primary)]" />
                  )}
                </span>
                {r.label}
              </label>
            ))}
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] leading-4 font-semibold text-[#4a5565]">
              Additional details (optional)
            </span>
            <span className="relative">
              <textarea
                value={details}
                maxLength={MAX_DETAILS}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us what needs to be corrected..."
                className="w-full h-[108px] resize-none px-4 py-3 pb-7 rounded-xl border border-[#e5e7eb] text-[14px] leading-5 text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:border-[var(--auth-primary)]"
              />
              <span className="absolute right-3 bottom-3 text-[12px] leading-4 text-[#6b7280]">
                {details.length} / {MAX_DETAILS}
              </span>
            </span>
            <span className="text-[12px] leading-4 text-[#6b7280]">
              Your feedback helps us improve the question bank.
            </span>
          </label>

          <div className="flex justify-end items-center gap-3">
            <DialogPrimitive.Close className="px-5 py-2.5 text-[14px] leading-5 font-semibold text-[var(--auth-primary-dark-1)]">
              Cancel
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[var(--auth-primary)] text-[14px] leading-5 font-semibold text-white disabled:opacity-60">
              {submitting ? "Sending..." : "Submit report"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
