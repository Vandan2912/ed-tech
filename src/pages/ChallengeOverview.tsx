import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Info, Loader2, Sparkles } from "lucide-react";
import {
  createQuiz,
  generateStage,
  uploadQuizSource,
  waitForStageReady,
  type Difficulty,
} from "@/api/quizzes";
import { CountStepper } from "@/components/challenge/CountStepper";
import { STAGE_LABEL, STAGE_ORDER } from "@/components/challenge/stages";
import { cn, getApiErrorMessage } from "@/lib/utils";

/** Route state handed over by the home page AI Challenge panel. */
export type ChallengeDraft = {
  topicName: string;
  description: string;
  file?: File;
};

const STAGE_BADGE: Record<Difficulty, string> = {
  easy: "bg-[#1fc16b]/10 text-[#0e8f4a]",
  medium: "bg-[#ffdb43]/10 text-[#c1a015]",
  hard: "bg-[#fb3748]/10 text-[#d00416]",
};

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 40;
const MIN_SECONDS = 10;
const MAX_SECONDS = 60;
const SECONDS_STEP = 5;

export default function ChallengeOverview() {
  const draft = useLocation().state as ChallengeDraft | null;
  const navigate = useNavigate();

  const [counts, setCounts] = useState<Record<Difficulty, number>>({
    easy: 5,
    medium: 5,
    hard: 5,
  });
  const [seconds, setSeconds] = useState(20);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refreshing loses the route state (and any picked file) — start over.
  if (!draft?.topicName) return <Navigate to="/" replace />;

  const totalQuestions = counts.easy + counts.medium + counts.hard;
  const totalMinutes = Math.ceil((totalQuestions * seconds) / 60);

  const start = async () => {
    setError(null);
    try {
      setProgress("Creating your quiz...");
      const quiz = await createQuiz({
        topicName: draft.topicName,
        description: draft.description,
        sourceType: draft.file ? "file" : "topic",
        timePerQuestionSeconds: seconds,
        stages: counts,
      });

      if (draft.file) {
        setProgress("Uploading your file...");
        await uploadQuizSource(quiz.id, draft.file);
      }

      setProgress("Generating questions...");
      await Promise.all(quiz.stages.map((s) => generateStage(quiz.id, s.id)));
      await waitForStageReady(quiz.stages[0].id);

      navigate(`/challenge/${quiz.id}`, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't start the quiz. Try again."));
      setProgress(null);
    }
  };

  const busy = progress !== null;

  return (
    <div className="bg-white px-4 py-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-[724px] flex-col items-center gap-6 border border-[#f3f4f6] bg-white p-4 sm:p-6">
        <div className="w-full border-b border-[#e8e8e8] pb-4">
          <h1 className="text-[24px] leading-[48px] font-bold text-[#101828]">
            Quiz Overview
          </h1>
          <p className="pt-2 text-[11px] font-bold leading-5 text-[#777]">
            Topic: {draft.topicName}
            {draft.file && (
              <span className="font-medium"> · Source: {draft.file.name}</span>
            )}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <h2 className="text-[15px] font-bold text-[#333]">Stages to Clear</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STAGE_ORDER.map((d) => (
              <div
                key={d}
                className="flex flex-col gap-3 rounded-[18px] border border-[#e8e8e8] bg-white p-4">
                <span
                  className={cn(
                    "self-start rounded-md px-2.5 py-0.5 text-[13px] font-bold",
                    STAGE_BADGE[d],
                  )}>
                  {STAGE_LABEL[d]}
                </span>
                <span className="text-[11px] font-medium text-[#8e8e8e]">
                  Questions to answer
                </span>
                <CountStepper
                  label={`${STAGE_LABEL[d]} questions`}
                  value={counts[d]}
                  min={MIN_QUESTIONS}
                  max={MAX_QUESTIONS}
                  onChange={(v) => setCounts((c) => ({ ...c, [d]: v }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#e8e8e8] bg-white px-4 py-4">
          <div>
            <p className="text-[13px] font-bold text-[#333]">
              Time per Question
            </p>
            <p className="pt-1 text-[11px] font-medium text-[#4a4a4a]">
              Maximum allowed: {MAX_SECONDS} sec
            </p>
          </div>
          <CountStepper
            label="seconds per question"
            value={seconds}
            min={MIN_SECONDS}
            max={MAX_SECONDS}
            step={SECONDS_STEP}
            suffix="sec"
            onChange={setSeconds}
          />
        </div>

        <div className="flex w-full items-center gap-3 rounded-xl border border-[var(--auth-primary)]/10 bg-[#f0f9ff] px-4 py-3 text-[12px] font-medium text-[#777]">
          <Info size={16} className="shrink-0 text-[var(--auth-primary)]" />
          <span>
            Total Questions:{" "}
            <b className="font-bold text-[#101828]">{totalQuestions}</b>
            {"  ·  "}Estimated Total Time:{" "}
            <b className="font-bold text-[#101828]">{totalMinutes} min</b>
          </span>
        </div>

        {error && (
          <div className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={start}
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[10px] bg-[var(--auth-primary)] text-[16px] font-bold text-white drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] transition active:scale-[0.98] disabled:opacity-80">
          {busy ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Start Quiz
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={busy}
          className="text-[13px] font-bold text-[#777] hover:text-[#4a4a4a] disabled:opacity-50">
          Discard
        </button>
      </div>
    </div>
  );
}
