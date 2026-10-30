import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flag, Loader2, RotateCcw } from "lucide-react";
import { REPORT_ENABLED } from "@/api/quizzes";
import { getMyBest } from "@/api/ranks";
import { useChallengeSession } from "@/hooks/useChallengeSession";
import { StageStepper } from "@/components/challenge/StageStepper";
import { TimerRing } from "@/components/challenge/TimerRing";
import { OptionRow, type OptionState } from "@/components/challenge/OptionRow";
import {
  PerformanceCard,
  QuestionNavigator,
  SidebarButton,
} from "@/components/challenge/QuizSidebar";
import {
  PASS_RATIO,
  STAGE_CONFIG,
  STAGE_LABEL,
  STAGE_ORDER,
} from "@/components/challenge/stages";
import { StageResultCard } from "@/components/practice/StageResultCard";
import {
  TopicClearedCard,
  type StageScore,
} from "@/components/practice/TopicClearedCard";
import { ReportQuestionModal } from "@/components/practice/ReportQuestionModal";
import {
  isMistake,
  reviewOutcome,
  topicLosses,
  type Outcome,
} from "@/components/practice/outcomes";

const pageBg =
  "min-h-[calc(100vh-64px)] bg-[linear-gradient(141deg,#f0f9ff_0%,#ffffff_50%,#eff6ff_100%)]";

const card =
  "w-full bg-white border border-[#f3f4f6] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]";

export default function PracticePlay() {
  const { quizId = "" } = useParams();
  const navigate = useNavigate();
  const session = useChallengeSession(quizId);
  const [level, setLevel] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    getMyBest()
      .then((b) => setLevel(b.level))
      .catch(() => {});
  }, []);

  const goHome = () => navigate("/");
  const reviewPath = (wrongOnly = false) =>
    `/practice/${quizId}/review/${session.attemptId}${wrongOnly ? "?filter=wrong" : ""}`;
  const stageName = session.stage ? STAGE_LABEL[session.stage.difficulty] : "";
  const topic = session.quiz?.topic_name ?? "This topic";

  /* ---------------- Full-page states ---------------- */

  if (session.phase === "loading" && !session.question) {
    return (
      <div
        className={`${pageBg} flex flex-col items-center justify-center gap-3 text-[14px] font-semibold text-[#6b7280]`}>
        <Loader2 size={28} className="animate-spin text-[var(--auth-primary)]" />
        Preparing your questions...
      </div>
    );
  }

  if (session.phase === "error") {
    return (
      <div className={`${pageBg} flex justify-center px-4 py-16`}>
        <div className="flex flex-col items-center gap-4 w-full max-w-[480px] p-8 bg-white rounded-3xl border border-[#f3f4f6] text-center shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]">
          <h1 className="text-[22px] font-bold text-[#101828]">
            Something went wrong
          </h1>
          <p className="text-[14px] text-[#4a5565]">
            {session.error ?? "Please try again."}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={session.retry}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--auth-primary)] text-[14px] font-semibold text-white">
              <RotateCcw size={16} /> Try again
            </button>
            <button
              type="button"
              onClick={() => navigate("/practice")}
              className="px-5 py-3 rounded-xl border-[1.5px] border-[rgba(51,51,51,0.12)] text-[14px] font-semibold text-[#101828]">
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Outcomes from the review (or local answers) ---------------- */

  const reviewById = new Map(session.review?.questions.map((q) => [q.id, q]));
  const outcomeOf = (questionId: string): Outcome => {
    const reviewed = reviewById.get(questionId);
    if (reviewed) return reviewOutcome(reviewed);
    return session.answers[questionId]?.status ?? "skipped";
  };

  if (session.phase === "stage-passed" || session.phase === "stage-failed") {
    const difficulty = session.stage?.difficulty ?? "easy";
    const points = STAGE_CONFIG[difficulty].points;
    const total = session.questions.length * points;
    const losses = topicLosses(
      session.questions.map((q) => ({
        topic: q.topicName || topic,
        outcome: outcomeOf(q.id),
        points,
      })),
    );
    const mistakeCount = session.questions.filter((q) =>
      isMistake(outcomeOf(q.id)),
    ).length;
    const passed = session.phase === "stage-passed";
    const nextDifficulty = STAGE_ORDER[session.stageIndex + 1];

    return (
      <div className={pageBg}>
        <div className="max-w-[1129px] mx-auto flex flex-col items-center gap-6 px-4 sm:px-12 pt-8 pb-12">
          <StageStepper
            currentIndex={passed ? session.stageIndex + 1 : session.stageIndex}
          />
          <StageResultCard
            stageName={stageName}
            passed={passed}
            score={session.stagePoints}
            total={total}
            passScore={Math.ceil(total * PASS_RATIO)}
            attemptNumber={session.stageAttemptNumber}
            losses={losses}
            mistakeCount={mistakeCount}
            nextStageName={
              nextDifficulty ? STAGE_LABEL[nextDifficulty] : undefined
            }
            onReviewMistakes={() => navigate(reviewPath(true))}
            onReviewAll={() => navigate(reviewPath())}
            onPrimary={passed ? session.continueToNextStage : session.retryStage}
          />
        </div>
      </div>
    );
  }

  if (session.phase === "completed") {
    const reviewed = session.review?.questions ?? [];
    const stages: StageScore[] = STAGE_ORDER.flatMap((d) => {
      const qs = reviewed.filter((q) => q.difficulty === d);
      if (qs.length === 0) return [];
      const correct = qs.filter((q) => reviewOutcome(q) === "correct").length;
      const points = STAGE_CONFIG[d].points;
      return [
        {
          difficulty: d,
          score: correct * points,
          total: qs.length * points,
          correct,
          count: qs.length,
        },
      ];
    });
    const losses = topicLosses(
      reviewed.map((q) => ({
        topic: q.topicName || topic,
        outcome: reviewOutcome(q),
        points: STAGE_CONFIG[q.difficulty ?? "easy"].points,
      })),
    );
    const mistakeCount = reviewed.filter((q) =>
      isMistake(reviewOutcome(q)),
    ).length;

    return (
      <div className={pageBg}>
        <div className="max-w-[1129px] mx-auto flex flex-col items-center gap-6 px-4 sm:px-12 pt-8 pb-12">
          <StageStepper currentIndex={STAGE_ORDER.length} />
          <TopicClearedCard
            topic={topic}
            stages={stages}
            pointsEarned={session.completion?.totalPoints ?? session.points}
            bestBefore={session.completion?.bestBefore}
            bestAfter={session.completion?.bestAfter}
            losses={losses}
            mistakeCount={mistakeCount}
            onSeeDiagnosis={() => navigate(reviewPath(true))}
            onReviewAll={() => navigate(reviewPath())}
            onBackToToday={goHome}
          />
        </div>
      </div>
    );
  }

  /* ---------------- Quiz workspace ---------------- */

  const { question, currentAnswer, phase } = session;
  const revealed =
    phase === "revealing" || (phase === "finishing" && !!currentAnswer);
  const isLastQuestion = session.index === session.questions.length - 1;

  const optionState = (optionId: string): OptionState => {
    if (!revealed || !currentAnswer) {
      return session.selectedOptionId === optionId ? "selected" : "idle";
    }
    const { result, selectedOptionId, status } = currentAnswer;
    if (result.correctOptionId === optionId) return "correct";
    if (selectedOptionId === optionId) {
      return status === "correct" ? "correct" : "wrong";
    }
    return "neutral";
  };

  return (
    <div className={pageBg}>
      <div className="max-w-[1129px] mx-auto flex flex-col gap-6 px-4 pt-6 pb-16 lg:flex-row lg:gap-8 lg:px-12 lg:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className={`${card} rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
                {level !== null && (
                  <span className="px-2 py-1 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] text-[11px] leading-[14px] font-semibold text-[#4a5565]">
                    Level {level}
                  </span>
                )}
                <h1 className="text-[18px] leading-[26px] font-bold text-[#101828]">
                  {topic}
                </h1>
                {session.quiz?.description && (
                  <p className="line-clamp-1 text-[11px] leading-[14px] font-medium text-[#8c8c8c]">
                    {session.quiz.description}
                  </p>
                )}
                <StageStepper currentIndex={session.stageIndex} />
              </div>
              <TimerRing
                secondsLeft={session.secondsLeft}
                totalSeconds={session.timePerQuestion}
              />
            </div>
          </div>

          <div className={`${card} rounded-[20px] p-5 sm:p-8`}>
            {phase === "loading" ? (
              <div className="flex items-center justify-center gap-2 py-16 text-[14px] font-semibold text-[#6b7280]">
                <Loader2 size={18} className="animate-spin" />
                Preparing the next stage...
              </div>
            ) : (
              question && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold text-[#101828]">
                    {question.questionText}
                  </h2>
                  <div role="radiogroup" className="flex flex-col gap-3">
                    {question.options.map((opt, i) => (
                      <OptionRow
                        key={opt.id}
                        index={i}
                        text={opt.optionText}
                        state={optionState(opt.id)}
                        disabled={phase !== "playing"}
                        onSelect={() => session.selectOption(opt.id)}
                      />
                    ))}
                  </div>
                  <p className="text-[12px] leading-4 font-medium text-[#6b7280]">
                    Question {session.index + 1} of {session.questions.length}{" "}
                    · {stageName} stage · Peer stats appear only in review.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {REPORT_ENABLED && (
                      <button
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="flex items-center gap-1 px-1 py-3 text-[13px] leading-[18px] font-semibold text-[#dc2626]">
                        <Flag size={13} fill="currentColor" /> Report this
                        question
                      </button>
                    )}
                    {currentAnswer && (
                      <span className="px-3 py-1 rounded-full bg-[rgba(31,193,107,0.14)] text-[12px] leading-4 font-semibold text-[#15803d]">
                        ✓ Saved
                      </span>
                    )}
                    <span className="flex-1" />
                    {revealed ? (
                      <PrimaryButton
                        onClick={session.next}
                        disabled={phase === "finishing"}>
                        {phase === "finishing"
                          ? "Finishing..."
                          : isLastQuestion
                            ? "Finish stage"
                            : "Next question"}
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={session.submit}
                        disabled={
                          phase !== "playing" || !session.selectedOptionId
                        }>
                        {phase === "submitting"
                          ? "Submitting..."
                          : phase === "finishing"
                            ? "Finishing..."
                            : "Submit answer"}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[297px]">
          <PerformanceCard points={session.points} />
          <QuestionNavigator statuses={session.statuses} />
          <SidebarButton variant="exit" onClick={goHome}>
            End quiz &amp; save progress
          </SidebarButton>
        </aside>
      </div>

      {question && (
        <ReportQuestionModal
          questionId={question.id}
          open={reportOpen}
          onOpenChange={setReportOpen}
        />
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-[42px] w-full sm:w-[222px] rounded-lg bg-[var(--auth-primary)] text-[16px] font-bold text-white drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] transition active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100">
      {children}
    </button>
  );
}
