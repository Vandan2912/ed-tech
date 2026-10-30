import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TopicLoss = { topic: string; marks: number };

export type AttemptComparison = {
  score: [number, number];
  accuracy: [number, number];
  avgSeconds: [number, number];
};

const outlineBtn =
  "px-5 py-3 rounded-xl border-[1.5px] border-[rgba(51,51,51,0.12)] bg-white text-[14px] leading-5 font-semibold text-[#101828] transition hover:bg-gray-50";
const primaryBtn =
  "flex items-center justify-center w-full sm:w-[275px] h-[47px] px-5 rounded-xl bg-[var(--auth-primary)] text-[13px] leading-[18px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-60";

/** Stage diagnosis after finishing a stage (Figma 2094:10278 fail, 2094:10388 pass). */
export function StageResultCard({
  stageName,
  passed,
  score,
  total,
  passScore,
  attemptNumber,
  losses,
  mistakeCount,
  nextStageName,
  badgeLine,
  comparison,
  busy,
  onReviewMistakes,
  onReviewAll,
  onPrimary,
}: {
  stageName: string;
  passed: boolean;
  score: number;
  total: number;
  passScore: number;
  attemptNumber: number;
  losses: TopicLoss[];
  mistakeCount: number;
  nextStageName?: string;
  badgeLine?: string;
  /** No API yet — the card is hidden until this is provided. */
  comparison?: AttemptComparison;
  busy?: boolean;
  onReviewMistakes: () => void;
  onReviewAll: () => void;
  onPrimary: () => void;
}) {
  const lost = losses.reduce((sum, l) => sum + l.marks, 0);
  const maxLoss = Math.max(1, ...losses.map((l) => l.marks));
  const oneTopicDominates = losses.length > 1 && losses[0].marks / lost > 0.4;

  const headline = passed
    ? lost > 0
      ? `Stage cleared, ${lost} ${lost === 1 ? "mark" : "marks"} still lost`
      : "Stage cleared with full marks"
    : `Not cleared yet: ${Math.max(0, passScore - score)} marks to go`;

  const sentence = passed
    ? `You scored ${score} of ${total}.${nextStageName ? ` ${nextStageName} is unlocked.` : ""}${
        lost > 0
          ? ` Fix the ${lost} lost ${lost === 1 ? "mark" : "marks"} now so they don't follow you to the next stage.`
          : ""
      }`
    : `You scored ${score} of ${total} and need ${passScore} to clear ${stageName}.${
        oneTopicDominates
          ? " Most lost marks come from one topic, so this is very fixable."
          : ""
      }`;

  return (
    <div className="flex flex-col gap-6 w-full px-5 py-6 sm:px-10 sm:py-8 bg-white border border-[#f3f4f6] rounded-3xl shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <span
          className={cn(
            "flex items-center justify-center size-16 shrink-0 rounded-full",
            passed ? "bg-[rgba(31,193,107,0.15)]" : "bg-[rgba(239,68,68,0.15)]",
          )}>
          {passed ? (
            <Check size={28} strokeWidth={2.5} className="text-[#15803d]" />
          ) : (
            <ArrowUpRight size={28} strokeWidth={2.5} className="text-[#dc2626]" />
          )}
        </span>
        <div className="flex flex-col items-start gap-1.5 min-w-0">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[12px] leading-4 font-semibold",
              passed
                ? "bg-[rgba(31,193,107,0.14)] text-[#15803d]"
                : "bg-[rgba(239,68,68,0.14)] text-[#dc2626]",
            )}>
            {stageName} stage · {passed ? "Cleared" : `Attempt ${attemptNumber}`}
          </span>
          <h1 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-[#101828]">
            {headline}
          </h1>
          <p className="text-[16px] leading-6 text-[#4a5565]">{sentence}</p>
          {passed && badgeLine && (
            <p className="flex items-center gap-2 text-[12px] leading-4 font-medium text-[#6b7280]">
              <span className="size-2 rounded-full bg-[#f59e0b]" />
              {badgeLine}
            </p>
          )}
        </div>
      </div>

      {(losses.length > 0 || comparison) && (
        <div className="flex flex-col md:flex-row gap-5">
          {losses.length > 0 && (
            <div className="flex-1 min-w-0 flex flex-col gap-4 p-5 rounded-2xl bg-[#fafbfc] border border-[#f3f4f6]">
              <div className="flex items-start font-bold">
                <p className="flex-1 text-[16px] leading-6 text-[#101828]">
                  Where your marks went
                </p>
                <p className="text-[13px] leading-[18px] text-[#dc2626] whitespace-nowrap">
                  {lost} {lost === 1 ? "mark" : "marks"} lost
                </p>
              </div>
              {losses.map(({ topic, marks }) => (
                <div key={topic} className="flex items-center gap-3">
                  <p className="w-[110px] sm:w-[140px] shrink-0 truncate text-[13px] leading-[18px] font-medium text-[#4a5565]">
                    {topic}
                  </p>
                  <div className="flex-1 h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[rgba(239,68,68,0.85)]"
                      style={{ width: `${(marks / maxLoss) * 50}%` }}
                    />
                  </div>
                  <p className="text-[13px] leading-[18px] font-bold text-[#dc2626]">
                    −{marks}
                  </p>
                </div>
              ))}
            </div>
          )}

          {comparison && (
            <div className="md:w-[300px] shrink-0 flex flex-col gap-4 p-5 rounded-2xl bg-[#fafbfc] border border-[#f3f4f6]">
              <p className="text-[16px] leading-6 font-bold text-[#101828]">
                Compared with last attempt
              </p>
              <CompareRow
                label="Score"
                from={comparison.score[0]}
                to={comparison.score[1]}
              />
              <CompareRow
                label="Accuracy"
                from={comparison.accuracy[0]}
                to={comparison.accuracy[1]}
                unit="%"
              />
              <CompareRow
                label="Avg time / Q"
                from={comparison.avgSeconds[0]}
                to={comparison.avgSeconds[1]}
                unit="s"
                lowerIsBetter
              />
            </div>
          )}
        </div>
      )}

      {mistakeCount > 0 && (
        <>
          <p className="text-[16px] leading-6 font-bold text-[#101828]">
            Review, Practice &amp; Progress
          </p>
          <div className="flex flex-col gap-2 min-h-[150px] p-4 rounded-2xl bg-white border border-[#f3f4f6]">
            <p className="text-[16px] leading-6 font-bold text-[#101828]">
              Review your {mistakeCount}{" "}
              {mistakeCount === 1 ? "mistake" : "mistakes"}
            </p>
            <p className="text-[12px] leading-4 text-[#6b7280]">
              Review your {mistakeCount}{" "}
              {mistakeCount === 1 ? "question" : "questions"} which you have
              given a wrong answer. Ask with AI the answer in detail
            </p>
            <span className="flex-1" />
            <button
              type="button"
              onClick={onReviewMistakes}
              className="self-start px-1 py-3 text-[13px] leading-[18px] font-semibold text-[var(--auth-primary-dark-1)] hover:underline">
              Review {mistakeCount}{" "}
              {mistakeCount === 1 ? "question" : "questions"}
            </button>
          </div>
        </>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button type="button" onClick={onReviewAll} className={outlineBtn}>
          Review all questions
        </button>
        <button
          type="button"
          onClick={onPrimary}
          disabled={busy}
          className={primaryBtn}>
          {passed
            ? nextStageName
              ? `Continue to ${nextStageName}`
              : "Continue"
            : `Try ${stageName} again`}
        </button>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  from,
  to,
  unit = "",
  lowerIsBetter,
}: {
  label: string;
  from: number;
  to: number;
  unit?: string;
  lowerIsBetter?: boolean;
}) {
  const delta = to - from;
  const good = lowerIsBetter ? delta <= 0 : delta >= 0;
  return (
    <div className="flex items-center gap-2">
      <p className="flex-1 text-[13px] leading-[18px] font-medium text-[#6b7280]">
        {label}
      </p>
      <p className="text-[13px] leading-[18px] font-bold text-[#101828] whitespace-nowrap">
        {from}
        {unit} → {to}
        {unit}
      </p>
      <span
        className={cn(
          "px-3 py-1 rounded-full text-[12px] leading-4 font-semibold",
          good
            ? "bg-[rgba(31,193,107,0.14)] text-[#15803d]"
            : "bg-[rgba(239,68,68,0.14)] text-[#dc2626]",
        )}>
        {delta > 0 ? "+" : delta < 0 ? "−" : ""}
        {Math.abs(delta)}
        {unit}
      </span>
    </div>
  );
}
