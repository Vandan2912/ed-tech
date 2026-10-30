import { Loader2, RotateCcw, Sparkles } from "lucide-react";

export type AskAiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; text: string };

/** AI tutor box under a reviewed question: prompt button → loader → answer. */
export function AskAiPanel({
  state,
  onAsk,
}: {
  state: AskAiState;
  onAsk: () => void;
}) {
  if (state.status === "idle") {
    return (
      <button
        type="button"
        onClick={onAsk}
        className="flex h-[42px] items-center justify-center gap-2 self-start rounded-lg border border-[var(--auth-primary)]/20 bg-[#f0f9ff] px-4 text-[14px] font-bold text-[var(--auth-primary)] transition hover:bg-[#e0f2fe] active:scale-[0.98]">
        <Sparkles size={16} /> Ask AI: Show Steps
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--auth-primary)]/10 bg-[#f0f9ff] p-4">
      <p className="flex items-center gap-2 text-[12px] font-bold text-[var(--auth-primary)]">
        <Sparkles size={14} /> AI Tutor
      </p>
      {state.status === "loading" && (
        <p className="flex items-center gap-2 text-[14px] font-medium text-[#6b7280]">
          <Loader2 size={16} className="animate-spin" />
          Working through the steps...
        </p>
      )}
      {state.status === "error" && (
        <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium text-red-600">
          {state.message}
          <button
            type="button"
            onClick={onAsk}
            className="flex items-center gap-1 font-bold text-[var(--auth-primary)] hover:underline">
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      )}
      {state.status === "done" && (
        <p className="whitespace-pre-wrap text-[14px] leading-6 text-[#101828]">
          {state.text}
        </p>
      )}
    </div>
  );
}
