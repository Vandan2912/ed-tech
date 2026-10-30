import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  askAi,
  getAttemptReview,
  getQuestionStatistics,
  REPORT_ENABLED,
  tagMistake,
  waitForJob,
  type AttemptReview,
  type QuestionStatistics,
  type ReviewQuestion,
} from "@/api/quizzes";
import { OptionRow, type OptionState } from "@/components/challenge/OptionRow";
import { QuestionNavigator } from "@/components/challenge/QuizSidebar";
import { STAGE_LABEL } from "@/components/challenge/stages";
import { AskAiDrawer } from "@/components/practice/AskAiDrawer";
import { ReportQuestionModal } from "@/components/practice/ReportQuestionModal";
import { isMistake, reviewOutcome } from "@/components/practice/outcomes";
import { cn, getApiErrorMessage } from "@/lib/utils";

const pageBg =
  "min-h-[calc(100vh-64px)] bg-[linear-gradient(136deg,#f0f9ff_0%,#ffffff_50%,#eff6ff_100%)]";
const card =
  "w-full bg-white border border-[#f3f4f6] shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)]";
const LETTERS = "ABCDEFGH";

// ASSUMPTION: the backend hasn't shared its mistake-tag values yet.
const MISTAKE_TAGS = [
  { value: "concept", label: "Concept" },
  { value: "calculation", label: "Calculation" },
  { value: "misread", label: "Misread" },
  { value: "guess", label: "Guess" },
  { value: "time", label: "Time" },
];

type StepsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; text: string };

/** Splits a numbered AI answer into steps; returns null when it isn't numbered. */
const toSteps = (text: string) => {
  const parts = text
    .split(/\n(?=\s*(?:Step\s*\d+|\d+[.)])\s*)/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  return parts.map((p) => {
    const body = p.replace(/^(?:Step\s*\d+[:.)-]?|\d+[.)])\s*/i, "");
    const [title, ...rest] = body.split("\n");
    return { title: title.trim(), detail: rest.join("\n").trim() };
  });
};

export default function PracticeReview() {
  const { attemptId = "" } = useParams();
  const [params] = useSearchParams();
  const wrongOnly = params.get("filter") === "wrong";
  const navigate = useNavigate();

  const [review, setReview] = useState<AttemptReview | null>(null);
  console.log("review", review);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<Record<string, QuestionStatistics>>({});
  const [steps, setSteps] = useState<Record<string, StepsState>>({});
  const [savedTag, setSavedTag] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const load = () => {
    setError(null);
    getAttemptReview(attemptId)
      .then((r) => {
        setReview(r);
        // Open on the first mistake when coming from "Review N mistakes".
        if (wrongOnly) {
          const first = r.questions.findIndex((q) =>
            isMistake(reviewOutcome(q)),
          );
          if (first >= 0) setIndex(first);
        }
      })
      .catch((err) =>
        setError(getApiErrorMessage(err, "Couldn't load your review.")),
      );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [attemptId]);

  const question = review?.questions[index];

  useEffect(() => {
    if (!question || stats[question.id]) return;
    getQuestionStatistics(question.id)
      .then((s) => setStats((prev) => ({ ...prev, [question.id]: s })))
      .catch(() => {});
  }, [question, stats]);

  if (error) {
    return (
      <div className={`${pageBg} flex justify-center px-4 py-16`}>
        <div className="flex flex-col items-center gap-4 w-full max-w-[480px] p-8 bg-white rounded-3xl border border-[#f3f4f6] text-center">
          <h1 className="text-[22px] font-bold text-[#101828]">
            Something went wrong
          </h1>
          <p className="text-[14px] text-[#4a5565]">{error}</p>
          <button
            type="button"
            onClick={load}
            className="px-5 py-3 rounded-xl bg-[var(--auth-primary)] text-[14px] font-semibold text-white">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div
        className={`${pageBg} flex flex-col items-center justify-center gap-3 text-[14px] font-semibold text-[#6b7280]`}>
        <Loader2
          size={28}
          className="animate-spin text-[var(--auth-primary)]"
        />
        Loading your answers...
      </div>
    );
  }

  const outcomes = review.questions.map(reviewOutcome);
  const total = review.questions.length;

  if (!question) {
    return (
      <div className={`${pageBg} flex justify-center px-4 py-16`}>
        <p className="text-[14px] font-semibold text-[#6b7280]">
          No answers to review yet.
        </p>
      </div>
    );
  }

  const outcome = outcomes[index];
  const nextIndex = wrongOnly
    ? outcomes.findIndex((o, i) => i > index && isMistake(o))
    : index + 1 < total
      ? index + 1
      : -1;
  const optionText = (id?: string) =>
    question.options.find((o) => o.id === id)?.optionText;
  const letterOf = (id?: string) => {
    const i = question.options.findIndex((o) => o.id === id);
    return i >= 0 ? LETTERS[i] : undefined;
  };

  const topic = review.quiz?.topic_name ?? question.topicName;
  const stageLabel = question.difficulty
    ? `${STAGE_LABEL[question.difficulty]} stage`
    : null;
  const attemptLabel = review.attempt?.attempt_number
    ? `Attempt ${review.attempt.attempt_number}`
    : null;

  const setTag = async (q: ReviewQuestion, tag: string) => {
    const previous = q.mistakeTag ?? null;
    const next = previous === tag ? null : tag;
    const patch = (value: string | null) =>
      setReview(
        (r) =>
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
      setSavedTag((s) => ({ ...s, [q.id]: next !== null }));
    } catch (err) {
      patch(previous);
      toast.error(getApiErrorMessage(err, "Couldn't save the tag."));
    }
  };

  const loadSteps = async (q: ReviewQuestion) => {
    setSteps((s) => ({ ...s, [q.id]: { status: "loading" } }));
    try {
      const { jobId } = await askAi({
        questionId: q.id,
        quizAttemptId: attemptId,
        conversationType: "ai_tutor",
        action: "show_steps",
      });
      const text = await waitForJob(jobId, { quizAttemptId: attemptId });
      setSteps((s) => ({ ...s, [q.id]: { status: "done", text } }));
    } catch (err) {
      setSteps((s) => ({
        ...s,
        [q.id]: {
          status: "error",
          message: getApiErrorMessage(err, "Couldn't load the solution."),
        },
      }));
    }
  };

  const optionState = (optionId: string): OptionState => {
    if (question.correctOptionId === optionId) return "correct";
    if (question.selectedOptionId === optionId) {
      return outcome === "correct" ? "correct" : "wrong";
    }
    return "neutral";
  };

  const peer = stats[question.id]?.optionPercentages;
  const stepState = steps[question.id];

  return (
    <div className={pageBg}>
      <div className="max-w-[1129px] mx-auto flex flex-col gap-6 px-4 sm:px-12 pt-8 pb-12">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-1 py-3 text-[14px] leading-5 font-semibold text-[var(--auth-primary-dark-1)]">
            <ArrowLeft size={16} /> Back
          </button>
          <span className="flex-1" />
          <p className="text-[13px] leading-[18px] font-medium text-[#6b7280] text-right">
            {[topic, stageLabel, attemptLabel].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
            <div
              className={`${card} flex flex-col gap-8 p-5 sm:p-8 rounded-[20px]`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[rgba(74,74,74,0.08)] text-[12px] leading-4 font-semibold text-[#4a5565]">
                  Question {index + 1} of {total}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[12px] leading-4 font-semibold",
                    outcome === "correct" &&
                      "bg-[rgba(31,193,107,0.14)] text-[#15803d]",
                    outcome === "wrong" &&
                      "bg-[rgba(239,68,68,0.12)] text-[#dc2626]",
                    (outcome === "skipped" || outcome === "answered") &&
                      "bg-[rgba(74,74,74,0.08)] text-[#4a5565]",
                  )}>
                  {outcome === "correct"
                    ? "Correct"
                    : outcome === "wrong"
                      ? "Wrong"
                      : outcome === "skipped"
                        ? "Skipped"
                        : "Answered"}
                </span>
              </div>

              <h1 className="text-[20px] leading-7 font-bold text-[#101828]">
                {question.questionText}
              </h1>

              <div className="flex flex-col gap-3">
                {question.options.map((opt, i) => (
                  <>
                    <>{JSON.stringify(opt)}</>
                    <OptionRow
                      key={opt.id}
                      index={i}
                      text={opt.optionText}
                      state={optionState(opt.id)}
                      variant="review"
                    />
                  </>
                ))}
              </div>

              {question.explanation && (
                <p className="p-4 rounded-xl bg-[#f7f9fc] text-[14px] leading-6 text-[#4a5565]">
                  {question.explanation}
                </p>
              )}
            </div>

            {stepState && (
              <div
                className={`${card} flex flex-col gap-4 p-5 sm:p-6 rounded-[20px]`}>
                <h2 className="text-[16px] leading-6 font-bold text-[#101828]">
                  Step-by-step solution
                </h2>
                {stepState.status === "loading" && (
                  <p className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                    <Loader2 size={16} className="animate-spin" /> Working
                    through the steps...
                  </p>
                )}
                {stepState.status === "error" && (
                  <p className="text-[14px] text-[#dc2626]">
                    {stepState.message}{" "}
                    <button
                      type="button"
                      onClick={() => loadSteps(question)}
                      className="font-semibold text-[var(--auth-primary-dark-1)] hover:underline">
                      Retry
                    </button>
                  </p>
                )}
                {stepState.status === "done" &&
                  (
                    toSteps(stepState.text) ?? [
                      { title: "", detail: stepState.text },
                    ]
                  ).map((s, i, all) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col gap-1 p-4 rounded-xl border",
                        i === 0
                          ? "bg-[#e7f5fd] border-[#cfebfb]"
                          : "bg-[#fafbfc] border-[#f3f4f6]",
                      )}>
                      {all.length > 1 && (
                        <p className="flex items-center gap-2 text-[14px] leading-5 font-semibold text-[#101828]">
                          <span className="px-2 py-0.5 rounded bg-[#cfebfb] text-[11px] leading-[14px] font-bold text-[var(--auth-primary-dark-1)]">
                            Step {i + 1}
                          </span>
                          {s.title}
                        </p>
                      )}
                      {s.detail && (
                        <p className="whitespace-pre-wrap text-[13px] leading-5 text-[#4a5565]">
                          {s.detail}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(true);
                  if (!stepState) void loadSteps(question);
                }}
                className="px-5 py-3 rounded-xl bg-[var(--auth-primary)] text-[14px] leading-5 font-semibold text-white">
                Ask why
              </button>
              <button
                type="button"
                disabled={nextIndex < 0}
                onClick={() => setIndex(nextIndex)}
                className="flex items-center gap-1 px-5 py-3 rounded-xl border-[1.5px] border-[rgba(51,51,51,0.12)] bg-white text-[14px] leading-5 font-semibold text-[#101828] disabled:opacity-40">
                {wrongOnly ? "Next wrong question" : "Next question"}{" "}
                <ArrowRight size={14} />
              </button>
              <span className="flex-1" />
              {REPORT_ENABLED && (
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="flex items-center gap-1 px-1 py-3 text-[14px] leading-5 font-semibold text-[#dc2626]">
                  <Flag size={13} fill="currentColor" /> Report this question
                </button>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[297px] shrink-0 flex flex-col gap-6">
            <QuestionNavigator
              statuses={outcomes}
              activeIndex={index}
              onSelect={setIndex}
              compact
            />

            {isMistake(outcome) && (
              <div className={`${card} flex flex-col gap-3 p-5 rounded-2xl`}>
                <p className="text-[13px] leading-[18px] font-bold text-[#101828]">
                  Why did you miss it?<span className="text-[#dc2626]">*</span>
                </p>
                <p className="text-[12px] leading-4 text-[#6b7280]">
                  Tag the mistake so we can give you the right practice.
                </p>
                <div className="flex flex-wrap gap-2">
                  {MISTAKE_TAGS.map((t) => {
                    const active = question.mistakeTag === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setTag(question, t.value)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] leading-4 font-semibold transition",
                          active
                            ? "bg-[rgba(19,156,237,0.15)] text-[var(--auth-primary-dark-1)]"
                            : "bg-[rgba(74,74,74,0.06)] border border-[#e5e7eb] text-[#4a5565] hover:bg-[rgba(74,74,74,0.1)]",
                        )}>
                        {active && (
                          <span className="size-1.5 rounded-full bg-[var(--auth-primary-dark-1)]" />
                        )}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                {(savedTag[question.id] ?? !!question.mistakeTag) && (
                  <p className="flex items-center gap-1.5 p-3 rounded-xl bg-[rgba(31,193,107,0.08)] text-[12px] leading-4 font-semibold text-[#15803d]">
                    <Check size={12} strokeWidth={2.5} /> Saved to your Mistake
                    Bank
                  </p>
                )}
              </div>
            )}

            {peer && Object.keys(peer).length > 0 && (
              <div
                className={`${card} flex flex-col gap-2 px-5 py-4 rounded-2xl`}>
                <p className="text-[13px] leading-[18px] font-bold text-[#101828]">
                  How others answered
                </p>
                <p className="text-[11px] leading-[14px] text-[#6b7280]">
                  Shown only after you answer.
                </p>
                {question.options.map((opt, i) => (
                  <div
                    key={opt.id}
                    className="flex items-center gap-2 text-[12px] leading-4">
                    <p className="flex-1 min-w-0 truncate font-medium text-[#4a5565]">
                      {LETTERS[i]} · {opt.optionText}
                    </p>
                    <p className="font-bold text-[#101828]">
                      {String(Math.round(peer[opt.id] ?? 0)).padStart(2, "0")}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      <AskAiDrawer
        key={question.id}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        context={{
          questionId: question.id,
          quizAttemptId: attemptId,
          number: index + 1,
          topic,
          questionText: question.questionText,
          yourAnswer: question.selectedOptionId
            ? `${letterOf(question.selectedOptionId)} · ${optionText(question.selectedOptionId)}`
            : undefined,
          correctAnswer: question.correctOptionId
            ? `${letterOf(question.correctOptionId)} · ${optionText(question.correctOptionId)}`
            : undefined,
          mistakeTag: question.mistakeTag ?? undefined,
        }}
      />
      <ReportQuestionModal
        questionId={question.id}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </div>
  );
}
