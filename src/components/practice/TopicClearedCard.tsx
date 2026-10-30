import { Check } from "lucide-react";
import type { Difficulty } from "@/api/quizzes";
import type { MyBestData } from "@/api/ranks";
import { STAGE_COLOR, STAGE_LABEL } from "@/components/challenge/stages";
import skilledBadge from "@/assets/practice/skilled-badge.png";
import type { TopicLoss } from "./StageResultCard";

export type StageScore = {
  difficulty: Difficulty;
  score: number;
  total: number;
  correct: number;
  count: number;
};

const outlineBtn =
  "px-5 py-3 rounded-xl border-[1.5px] border-[rgba(51,51,51,0.12)] bg-white text-[14px] leading-5 font-semibold text-[#101828] transition hover:bg-gray-50";

/** End-of-quiz summary once all three stages are cleared (Figma 2094:10923). */
export function TopicClearedCard({
  topic,
  stages,
  pointsEarned,
  bestBefore,
  bestAfter,
  losses,
  mistakeCount,
  onSeeDiagnosis,
  onReviewAll,
  onBackToToday,
}: {
  topic: string;
  stages: StageScore[];
  pointsEarned: number;
  bestBefore?: MyBestData | null;
  bestAfter?: MyBestData | null;
  losses: TopicLoss[];
  mistakeCount: number;
  onSeeDiagnosis: () => void;
  onReviewAll: () => void;
  onBackToToday: () => void;
}) {
  const scored = stages.reduce((s, x) => s + x.score, 0);
  const total = stages.reduce((s, x) => s + x.total, 0);
  const lost = total - scored;
  const worst = [...stages].sort(
    (a, b) => b.total - b.score - (a.total - a.score),
  )[0];

  return (
    <div className="flex flex-col gap-6 w-full px-5 py-6 sm:px-10 sm:py-8 bg-white border border-[#f3f4f6] rounded-3xl shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <img
          src={skilledBadge}
          alt=""
          width={96}
          height={96}
          className="size-24 shrink-0 object-cover"
        />
        <div className="flex flex-col items-start gap-1.5 min-w-0">
          <span className="px-3 py-1 rounded-full bg-[rgba(31,193,107,0.14)] text-[12px] leading-4 font-semibold text-[#15803d]">
            All 3 stages cleared
          </span>
          <h1 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-[#101828]">
            Topic cleared: {topic}
          </h1>
          {total > 0 && (
            <p className="text-[16px] leading-6 text-[#4a5565]">
              {scored} of {total} marks across Easy, Medium and Hard.
              {lost > 0 &&
                ` ${lost} marks were lost${worst ? `, mostly on ${STAGE_LABEL[worst.difficulty]}` : ""}. Fix them to master the topic.`}
            </p>
          )}
        </div>
      </div>

      {stages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stages.map((s) => (
            <div
              key={s.difficulty}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#fafbfc] border border-[#f3f4f6]">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: STAGE_COLOR[s.difficulty] }}
                />
                <p className="flex-1 text-[14px] leading-5 font-bold text-[#101828]">
                  {STAGE_LABEL[s.difficulty]}
                </p>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[rgba(31,193,107,0.14)] text-[12px] leading-4 font-semibold text-[#15803d]">
                  <Check size={12} strokeWidth={2.5} /> Cleared
                </span>
              </div>
              <p className="text-[24px] leading-8 font-bold text-[#101828]">
                {s.score} / {s.total}
              </p>
              <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.total ? (s.score / s.total) * 100 : 0}%`,
                    background: STAGE_COLOR[s.difficulty],
                  }}
                />
              </div>
              <p className="text-[12px] leading-4 font-medium text-[#6b7280]">
                {s.count ? Math.round((s.correct / s.count) * 100) : 0}% accuracy
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[16px] leading-6 font-bold text-[#101828]">Rewards</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 p-4 rounded-2xl bg-[rgba(35,58,232,0.06)]">
          <p className="text-[12px] leading-4 font-medium text-[#6b7280]">
            Points earned
          </p>
          <p className="text-[28px] leading-9 font-bold tracking-[-0.5px] text-[#233ae8]">
            +{pointsEarned}
          </p>
          {bestBefore && bestAfter && (
            <p className="text-[12px] leading-4 font-medium text-[#4a5565]">
              Total {bestBefore.totalXp.toLocaleString()} →{" "}
              {bestAfter.totalXp.toLocaleString()} pts
            </p>
          )}
        </div>
        {bestAfter && (
          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[rgba(19,156,237,0.07)]">
            <p className="text-[12px] leading-4 font-medium text-[#6b7280]">
              Level {bestAfter.level} → {bestAfter.level + 1}
            </p>
            <p className="text-[24px] leading-8 font-bold text-[var(--auth-primary-dark-1)]">
              {bestAfter.progress.percent}%
            </p>
            <div className="h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--auth-primary)]"
                style={{
                  width: `${Math.min(100, bestAfter.progress.percent)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {lost > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <p className="text-[14px] leading-5 font-bold text-[#101828]">
              {lost} marks still lost · {mistakeCount}{" "}
              {mistakeCount === 1 ? "question" : "questions"} saved to Mistake
              Bank
            </p>
            {losses.length > 0 && (
              <p className="text-[12px] leading-4 text-[#4a5565]">
                {losses
                  .slice(0, 4)
                  .map((l) => `${l.topic} (−${l.marks})`)
                  .join(" · ")}
              </p>
            )}
          </div>
          <button type="button" onClick={onSeeDiagnosis} className={outlineBtn}>
            See diagnosis
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button type="button" onClick={onReviewAll} className={outlineBtn}>
          Review all questions
        </button>
        <button type="button" onClick={onBackToToday} className={outlineBtn}>
          Back to Today
        </button>
      </div>
    </div>
  );
}
