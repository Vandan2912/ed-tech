import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
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
import { ResultCard } from "@/components/challenge/ResultCard";
import { STAGE_LABEL, STAGE_ORDER } from "@/components/challenge/stages";
import kingBadge from "@/assets/challenge/king-badge.png";

const pageBg =
  "min-h-[calc(100vh-64px)] bg-[linear-gradient(141deg,#f0f9ff_0%,#ffffff_50%,#eff6ff_100%)]";

const card =
  "w-full bg-white border border-[#f3f4f6] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]";

export default function ChallengePlay() {
  const { quizId = "" } = useParams();
  const navigate = useNavigate();
  const session = useChallengeSession(quizId);
  const [level, setLevel] = useState<number | null>(null);

  useEffect(() => {
    getMyBest()
      .then((b) => setLevel(b.level))
      .catch(() => {});
  }, []);

  const goHome = () => navigate("/");
  const stageName = session.stage
    ? STAGE_LABEL[session.stage.difficulty]
    : "";

  /* ---------------- Full-page states ---------------- */

  if (session.phase === "loading" && !session.question) {
    return <CenteredLoader label="Preparing your questions..." />;
  }

  if (session.phase === "error") {
    return (
      <div className={`${pageBg} flex justify-center px-4 py-10`}>
        <ResultCard
          tone="error"
          title="Something went wrong"
          message={session.error ?? "Please try again."}
          primary={{
            label: (
              <>
                <RotateCcw size={18} /> Try Again
              </>
            ),
            onClick: session.retry,
          }}
          secondary={{ label: "Back to Home", onClick: goHome }}
        />
      </div>
    );
  }

  if (session.phase === "stage-failed") {
    return (
      <div className="flex flex-col items-center gap-10 bg-white px-4 pt-10 pb-16">
        <StageStepper currentIndex={session.stageIndex} />
        <ResultCard
          tone="error"
          title="Attempt Failed!"
          message={`You were unable to clear the ${stageName} Stage.`}
          primary={{
            label: (
              <>
                <RotateCcw size={18} /> Try Again
              </>
            ),
            onClick: session.retry,
          }}
          secondary={{ label: "Take a Break", onClick: goHome }}>
          <span className="rounded-[9px] bg-[#ef4444]/[0.06] px-4 py-1.5 text-[14px] font-bold text-[#ef4444]">
            Don&apos;t worry, you can try again!
          </span>
        </ResultCard>
      </div>
    );
  }

  if (session.phase === "completed") {
    const badge = session.completion?.badge;
    const nextLevel = session.completion?.level;
    return (
      <div className="flex flex-col items-center gap-10 bg-white px-4 pt-10 pb-16">
        <StageStepper currentIndex={STAGE_ORDER.length} />
        <ResultCard
          tone="success"
          title="Hurray!"
          message={`You have successfully cleared all the stages of ${session.quiz?.topic_name ?? "this topic"}!`}
          primary={{
            label: (
              <>
                {nextLevel ? `Continue to Level ${nextLevel}` : "Continue"}
                <ArrowRight size={16} />
              </>
            ),
            onClick: goHome,
          }}
          secondary={{ label: "Start New Topic", onClick: goHome }}>
          {badge && (
            <div className="flex w-full max-w-[583px] items-center gap-3 rounded-[9px] bg-[#6c7cf0]/10 px-4 py-4 text-left">
              <img
                src={kingBadge}
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-xl shadow-[0px_10px_20px_-2px_rgba(0,0,0,0.18),0px_3px_6px_0px_rgba(0,0,0,0.3)]"
              />
              <div className="flex flex-col gap-2">
                <p className="text-[15px] font-bold text-[#6c7cf0]">
                  You earned {badge.name ? `a ${badge.name}` : "a badge"}!
                </p>
                {badge.description && (
                  <p className="text-[12px] font-medium leading-5 text-[#0a145f]">
                    {badge.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </ResultCard>
      </div>
    );
  }

  /* ---------------- Quiz workspace ---------------- */

  const { question, currentAnswer, phase } = session;
  const revealed = phase === "revealing" || (phase === "finishing" && !!currentAnswer);
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
      <div className="mx-auto flex max-w-[1129px] flex-col gap-6 px-4 pt-6 pb-16 lg:flex-row lg:gap-8 lg:px-12 lg:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Header */}
          <div className={`${card} rounded-2xl p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
                {level !== null && (
                  <span className="rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-2 py-1 text-[11px] leading-[9px] font-semibold text-[#374151]">
                    Level {level}
                  </span>
                )}
                <h1 className="text-[18px] leading-[30px] font-extrabold text-[#101828]">
                  {session.quiz?.topic_name}
                </h1>
                {session.quiz?.description && (
                  <p className="line-clamp-1 text-[11px] leading-4 font-medium text-[#8c8c8c]">
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

          {/* Question / stage-cleared card */}
          <div className={`${card} rounded-[20px] p-5 sm:p-8`}>
            {phase === "loading" ? (
              <div className="flex items-center justify-center gap-2 py-16 text-[14px] font-semibold text-[#6b7280]">
                <Loader2 size={18} className="animate-spin" />
                Preparing the next stage...
              </div>
            ) : phase === "stage-passed" ? (
              <StageClearedPanel
                stageName={stageName}
                nextStageName={
                  STAGE_LABEL[STAGE_ORDER[session.stageIndex + 1]] ?? ""
                }
                onContinue={session.continueToNextStage}
              />
            ) : (
              question && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-semibold text-[#8e8e8e]">
                      {stageName} · Question {session.index + 1} of{" "}
                      {session.questions.length}
                    </p>
                    <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold text-[#101828]">
                      {question.questionText}
                    </h2>
                  </div>
                  <div role="radiogroup" className="flex flex-col gap-3">
                    {question.options.map((opt, i) => (
                      <OptionRow
                        key={opt.id}
                        index={i}
                        text={opt.optionText}
                        state={optionState(opt.id)}
                        percent={
                          revealed
                            ? currentAnswer?.result.optionPercentages?.[opt.id]
                            : undefined
                        }
                        disabled={phase !== "playing"}
                        onSelect={() => session.selectOption(opt.id)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center">
                    {revealed ? (
                      <PrimaryButton
                        onClick={session.next}
                        disabled={phase === "finishing"}>
                        {phase === "finishing"
                          ? "Finishing..."
                          : isLastQuestion
                            ? "Finish Stage"
                            : "Next Question"}
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
                            : "Submit Answer"}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[297px]">
          <PerformanceCard points={session.points} />
          <QuestionNavigator statuses={session.statuses} />
          <SidebarButton variant="exit" onClick={goHome}>
            End Quiz &amp; Save Progress
          </SidebarButton>
          {phase === "stage-passed" && (
            <SidebarButton variant="break" onClick={goHome}>
              Take a Break
            </SidebarButton>
          )}
        </aside>
      </div>
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
      className="h-[42px] w-full max-w-[376px] rounded-lg bg-[var(--auth-primary)] text-[16px] font-bold text-white drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] transition active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100">
      {children}
    </button>
  );
}

function StageClearedPanel({
  stageName,
  nextStageName,
  onContinue,
}: {
  stageName: string;
  nextStageName: string;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="flex size-[58px] items-center justify-center rounded-full bg-[#1fc16b]/10">
        <span className="flex size-[39px] items-center justify-center rounded-full bg-[#1fc16b]">
          <Check size={17} strokeWidth={3} className="text-white" />
        </span>
      </span>
      <div className="flex flex-col gap-4">
        <h2 className="text-[24px] sm:text-[28px] leading-[1.2] font-bold text-[#111827]">
          Congratulation !
        </h2>
        <p className="text-[16px] sm:text-[18px] leading-[27px] font-medium text-[#111827]">
          You&rsquo;ve successfully completed the {stageName} Stage.
        </p>
        <p className="text-[14px] leading-5 font-medium text-[#6b7280]">
          Great job! Ready for the next challenge? {nextStageName} Stage
        </p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="h-[42px] w-full rounded-lg bg-[var(--auth-primary-dark-3)] text-[15px] font-bold text-white drop-shadow-[0px_10px_12px_rgba(16,185,129,0.2)] transition active:scale-[0.98]">
        Continue
      </button>
    </div>
  );
}

function CenteredLoader({ label }: { label: string }) {
  return (
    <div
      className={`${pageBg} flex flex-col items-center justify-center gap-3 text-[14px] font-semibold text-[#6b7280]`}>
      <Loader2 size={28} className="animate-spin text-[var(--auth-primary)]" />
      {label}
    </div>
  );
}
