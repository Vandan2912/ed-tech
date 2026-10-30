import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowUp, Loader2, X } from "lucide-react";
import { askAi, waitForJob, type AiAction } from "@/api/quizzes";
import { getApiErrorMessage } from "@/lib/utils";

const QUICK_ACTIONS: { action: AiAction; label: string }[] = [
  { action: "why_wrong", label: "Why is my answer wrong?" },
  { action: "show_steps", label: "Show steps" },
  { action: "explain_simpler", label: "Explain simpler" },
  { action: "similar_question", label: "Give a similar question" },
];

type Message =
  | { role: "user"; text: string }
  | { role: "ai"; status: "loading" }
  | { role: "ai"; status: "error"; text: string }
  | { role: "ai"; status: "done"; text: string };

export type AskAiContext = {
  questionId: string;
  quizAttemptId: string;
  number: number;
  topic: string;
  questionText: string;
  yourAnswer?: string;
  correctAnswer?: string;
  mistakeTag?: string;
};

/**
 * Right-hand AI tutor drawer for one reviewed question (Figma 2094:10682).
 * Key it by question id so each question starts a fresh conversation.
 */
export function AskAiDrawer({
  open,
  onOpenChange,
  context,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: AskAiContext;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const busy = messages.some((m) => m.role === "ai" && m.status === "loading");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = async (action: AiAction, label: string, message?: string) => {
    if (busy) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: label },
      { role: "ai", status: "loading" },
    ]);
    const settle = (reply: Message) =>
      setMessages((m) => [...m.slice(0, -1), reply]);
    try {
      const { jobId } = await askAi({
        questionId: context.questionId,
        quizAttemptId: context.quizAttemptId,
        conversationType: "ai_tutor",
        action,
        message,
      });
      const text = await waitForJob(jobId, {
        quizAttemptId: context.quizAttemptId,
      });
      settle({ role: "ai", status: "done", text });
    } catch (err) {
      settle({
        role: "ai",
        status: "error",
        text: getApiErrorMessage(err, "The AI tutor couldn't answer."),
      });
    }
  };

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void send("follow_up", text, text);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(16,24,40,0.3)] duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:max-w-[400px] bg-white shadow-[-16px_0_32px_-12px_rgba(88,92,95,0.2)] duration-200 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-start justify-between gap-3 px-4 pt-5 pb-3">
            <div>
              <DialogPrimitive.Title className="text-[16px] leading-6 font-bold text-[#101828]">
                Ask about this question
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[11px] leading-[14px] text-[#6b7280]">
                Mastishq AI · knows your answer and past mistakes
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="text-[#6b7280] focus-visible:outline-none">
              <X size={18} />
            </DialogPrimitive.Close>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#f7f9fc]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] leading-[14px] font-semibold text-[#6b7280]">
                  Q{context.number} · {context.topic}
                </p>
                {context.mistakeTag && (
                  <span className="px-3 py-1 rounded-full bg-[rgba(19,156,237,0.15)] text-[12px] leading-4 font-semibold text-[var(--auth-primary-dark-1)] capitalize">
                    {context.mistakeTag} mistake
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-[18px] font-bold text-[#101828]">
                {context.questionText}
              </p>
              <div className="flex flex-wrap gap-2">
                {context.yourAnswer && (
                  <span className="px-3 py-1 rounded-full bg-[rgba(239,68,68,0.12)] text-[12px] leading-4 font-semibold text-[#dc2626]">
                    Your answer: {context.yourAnswer}
                  </span>
                )}
                {context.correctAnswer && (
                  <span className="px-3 py-1 rounded-full bg-[rgba(31,193,107,0.14)] text-[12px] leading-4 font-semibold text-[#15803d]">
                    Correct: {context.correctAnswer}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(({ action, label }) => (
                <button
                  key={action}
                  type="button"
                  disabled={busy}
                  onClick={() => send(action, label)}
                  className="px-3 py-2 rounded-lg border border-[#cfebfb] bg-white text-[12px] leading-4 font-medium text-[var(--auth-primary-dark-1)] hover:bg-[#f0f9ff] disabled:opacity-50">
                  {label}
                </button>
              ))}
            </div>

            {messages.map((m, i) =>
              m.role === "user" ? (
                <p
                  key={i}
                  className="self-end max-w-[85%] px-4 py-2.5 rounded-2xl bg-[var(--auth-primary)] text-[13px] leading-[18px] font-medium text-white">
                  {m.text}
                </p>
              ) : (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#f7f9fc] text-[13px] leading-5 text-[#4a5565]">
                  {m.status === "loading" ? (
                    <span className="flex items-center gap-2 text-[#6b7280]">
                      <Loader2 size={14} className="animate-spin" /> Thinking...
                    </span>
                  ) : (
                    <p
                      className={
                        m.status === "error"
                          ? "text-[#dc2626]"
                          : "whitespace-pre-wrap"
                      }>
                      {m.text}
                    </p>
                  )}
                </div>
              ),
            )}
          </div>

          <form
            className="px-4 pt-3 pb-4 border-t border-[#f3f4f6]"
            onSubmit={(e) => {
              e.preventDefault();
              submitDraft();
            }}>
            <div className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl border border-[#e5e7eb]">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask a follow-up about this question..."
                className="flex-1 min-w-0 text-[13px] leading-[18px] text-[#101828] placeholder:text-[#99a1af] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={busy || !draft.trim()}
                className="flex items-center justify-center size-7 rounded-lg bg-[var(--auth-primary)] text-white disabled:opacity-50">
                <ArrowUp size={16} />
              </button>
            </div>
            <p className="pt-2 text-[11px] leading-[14px] font-medium text-[#15803d]">
              Practice-question doubts are unlimited.
            </p>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
