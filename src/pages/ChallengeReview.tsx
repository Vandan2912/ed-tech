import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  askAi,
  getAttemptReview,
  getQuestionStatistics,
  tagMistake,
  waitForJob,
  type AttemptReview,
  type QuestionStatistics,
  type ReviewQuestion,
} from "@/api/quizzes";
import { OptionRow, type OptionState } from "@/components/challenge/OptionRow";
import {
  QuestionNavigator,
  SidebarButton,
  type NavStatus,
} from "@/components/challenge/QuizSidebar";
import { AskAiPanel, type AskAiState } from "@/components/challenge/AskAiPanel";
import { ResultCard } from "@/components/challenge/ResultCard";
import { STAGE_LABEL } from "@/components/challenge/stages";
import { cn, getApiErrorMessage } from "@/lib/utils";

const pageBg =
  "min-h-[calc(100vh-64px)] bg-[linear-gradient(141deg,#f0f9ff_0%,#ffffff_50%,#eff6ff_100%)]";

const card =
  "w-full bg-white border border-[#f3f4f6] drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)]";

// ASSUMPTION: the backend hasn't shared its mistake-tag values yet.
const MISTAKE_TAGS = [
  { value: "concept_gap", label: "Concept gap" },
  { value: "careless", label: "Careless" },
  { value: "misread", label: "Misread" },
  { value: "guessed", label: "Guessed" },
];

const questionStatus = (q: ReviewQuestion): NavStatus => {
  if (q.status === "skipped") return "skipped";
  if (q.isCorrect === undefined) {
    if (q.correctOptionId) {
      return q.correctOptionId === q.selectedOptionId ? "correct" : "wrong";
    }
    return "answered";
  }
  return q.isCorrect ? "correct" : "wrong";
};

export default function ChallengeReview() {
  const { attemptId = "" } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState<AttemptReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<Record<string, QuestionStatistics>>({});
  const [ai, setAi] = useState<Record<string, AskAiState>>({});

  const load = () => {
    setError(null);
    getAttemptReview(attemptId)
      .then(setReview)
      .catch((err) =>
        setError(getApiErrorMessage(err, "Couldn't load your review.")),
      );
  };

  useEffect(load, [attemptId]);

  const question = review?.questions[index];

  // Statistics are fetched lazily, once per question.
  useEffect(() => {
    if (!question || stats[question.id]) return;
    getQuestionStatistics(question.id)
      .then((s) => setStats((prev) => ({ ...prev, [question.id]: s })))
      .catch(() => {});
  }, [question, stats]);

  if (error) {
    return (
      <div className={`${pageBg} flex justify-center px-4 py-10`}>
        <ResultCard
          tone="error"
          title="Something went wrong"
          message={error}
          primary={{ label: "Try Again", onClick: load }}
          secondary={{ label: "Back to Home", onClick: () => navigate("/") }}
        />
      </div>
    );
  }

  if (!review) {
    return (
      <div
        className={`${pageBg} flex flex-col items-center justify-center gap-3 text-[14px] font-semibold text-[#6b7280]`}>
        <Loader2 size={28} className="animate-spin text-[var(--auth-primary)]" />
        Loading your answers...
      </div>
    );
  }

  const statuses = review.questions.map(questionStatus);
  const correctCount = statuses.filter((s) => s === "correct").length;

  const setTag = async (q: ReviewQuestion, tag: string) => {
    const previous = q.mistakeTag ?? null;
    const next = previous === tag ? null : tag;
    const patch = (value: string | null) =>
      setReview((r) =>
        r && {
          ...r,
          questions: r.questions.map((x) =>
            x.id === q.id ? { ...x, mistakeTag: value } : x,
          ),
        },
      );
    patch(next);
    try {
      await tagMistake(q.id, { quizAttemptId: attemptId, mistakeTag: next });
    } catch (err) {
      patch(previous);
      toast.error(getApiErrorMessage(err, "Couldn't save the tag."));
    }
  };

  const askForSteps = async (q: ReviewQuestion) => {
    setAi((prev) => ({ ...prev, [q.id]: { status: "loading" } }));
    try {
      const { jobId } = await askAi({
        questionId: q.id,
        quizAttemptId: attemptId,
        conversationType: "ai_tutor",
        action: "show_steps",
      });
      const text = await waitForJob(jobId, { quizAttemptId: attemptId });
      setAi((prev) => ({ ...prev, [q.id]: { status: "done", text } }));
    } catch (err) {
      setAi((prev) => ({
        ...prev,
        [q.id]: {
          status: "error",
          message: getApiErrorMessage(err, "The AI tutor couldn't answer."),
        },
      }));
    }
  };

  const optionState = (q: ReviewQuestion, optionId: string): OptionState => {
    if (q.correctOptionId === optionId) return "correct";
    if (q.selectedOptionId === optionId) {
      return statuses[index] === "correct" ? "correct" : "wrong";
    }
    return "neutral";
  };

  const status = statuses[index];

  return (
    <div className={pageBg}>
      <div className="mx-auto flex max-w-[1129px] flex-col gap-6 px-4 pt-6 pb-16 lg:flex-row lg:gap-8 lg:px-12 lg:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Header */}
          <div className={`${card} flex flex-col gap-2 rounded-2xl p-5 sm:p-6`}>
            <p className="text-[12px] font-semibold text-[#8e8e8e]">
              Answer Review
            </p>
            <h1 className="text-[18px] leading-[30px] font-extrabold text-[#101828]">
              {review.quiz?.topic_name ?? "Your quiz"}
            </h1>
            <p className="text-[13px] font-medium text-[#4a4a4a]">
              <b className="font-bold text-[#1fc16b]">{correctCount}</b> of{" "}
              {review.questions.length} correct
            </p>
          </div>

          {/* Question */}
          <div className={`${card} rounded-[20px] p-5 sm:p-8`}>
            {question ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-semibold text-[#8e8e8e]">
                    {question.difficulty
                      ? `${STAGE_LABEL[question.difficulty]} · `
                      : ""}
                    Question {index + 1} of {review.questions.length}
                    {status === "skipped" && " · Skipped"}
                  </p>
                  <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold text-[#101828]">
                    {question.questionText}
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {question.options.map((opt, i) => (
                    <OptionRow
                      key={opt.id}
                      index={i}
                      text={opt.optionText}
                      state={optionState(question, opt.id)}
                      percent={
                        stats[question.id]?.optionPercentages?.[opt.id]
                      }
                      disabled
                    />
                  ))}
                </div>

                {question.explanation && (
                  <p className="rounded-xl bg-[#f9fafb] p-4 text-[14px] leading-6 text-[#374151]">
                    {question.explanation}
                  </p>
                )}

                {(status === "wrong" || status === "skipped") && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-bold text-[#333]">
                      Why did you miss this?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MISTAKE_TAGS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          aria-pressed={question.mistakeTag === t.value}
                          onClick={() => setTag(question, t.value)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
                            question.mistakeTag === t.value
                              ? "border-[var(--auth-primary)] bg-[var(--auth-primary)] text-white"
                              : "border-[#d2d2d2] bg-white text-[#4a4a4a] hover:bg-gray-50",
                          )}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AskAiPanel
                  state={ai[question.id] ?? { status: "idle" }}
                  onAsk={() => askForSteps(question)}
                />

                <div className="flex justify-between gap-3">
                  <NavButton
                    disabled={index === 0}
                    onClick={() => setIndex((i) => i - 1)}>
                    <ArrowLeft size={16} /> Previous
                  </NavButton>
                  <NavButton
                    disabled={index >= review.questions.length - 1}
                    onClick={() => setIndex((i) => i + 1)}>
                    Next <ArrowRight size={16} />
                  </NavButton>
                </div>
              </div>
            ) : (
              <p className="py-16 text-center text-[14px] font-semibold text-[#6b7280]">
                No answers to review yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[297px]">
          <QuestionNavigator
            statuses={statuses}
            activeIndex={index}
            onSelect={setIndex}
          />
          <SidebarButton variant="break" onClick={() => navigate("/")}>
            Back to Home
          </SidebarButton>
        </aside>
      </div>
    </div>
  );
}

function NavButton({
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
      className="flex h-10 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 text-[14px] font-bold text-[#374151] transition hover:bg-gray-50 disabled:opacity-40">
      {children}
    </button>
  );
}
