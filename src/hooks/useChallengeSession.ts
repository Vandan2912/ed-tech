import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  answerQuestion,
  completeQuiz,
  completeStage,
  generateStage,
  getQuiz,
  getStageQuestions,
  startQuiz,
  waitForStageReady,
  type AnswerResult,
  type Quiz,
  type QuizCompleteResult,
  type QuizQuestion,
  type QuizStage,
} from "@/api/quizzes";
import { getMyBest } from "@/api/ranks";
import { getApiErrorMessage } from "@/lib/utils";
import { PASS_RATIO, STAGE_POINTS } from "@/components/challenge/stages";
import type { NavStatus } from "@/components/challenge/QuizSidebar";

export type SessionPhase =
  | "loading" // starting attempt / waiting for questions
  | "playing"
  | "submitting"
  | "revealing" // answer submitted, showing correct/wrong
  | "finishing" // completing stage / quiz
  | "stage-passed"
  | "stage-failed"
  | "completed"
  | "error";

export type AnswerRecord = {
  status: Extract<NavStatus, "correct" | "wrong" | "answered" | "skipped">;
  selectedOptionId?: string;
  result: AnswerResult;
};

export type Completion = QuizCompleteResult & { level?: number };

/**
 * Drives one AI Challenge attempt: start/resume → per-question answer with a
 * countdown → complete each stage → complete the quiz.
 */
export function useChallengeSession(quizId: string) {
  const [phase, setPhase] = useState<SessionPhase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [stage, setStage] = useState<QuizStage | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [points, setPoints] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completion, setCompletion] = useState<Completion | null>(null);

  // Values async handlers need without waiting for a re-render.
  const attemptIdRef = useRef<string | null>(null);
  const stageAttemptIdRef = useRef<string | null>(null);
  const answersRef = useRef<Record<string, AnswerRecord>>({});
  const nextStageRef = useRef<{ stage?: QuizStage; attemptId: string } | null>(
    null,
  );
  const questionStartedAtRef = useRef(new Date().toISOString());
  const deadlineRef = useRef(0);
  const startedRef = useRef(false);

  const timePerQuestion = quiz?.time_per_question_seconds ?? 20;
  const stageIndex =
    quiz && stage ? quiz.stages.findIndex((s) => s.id === stage.id) : 0;

  const fail = (err: unknown, fallback: string) => {
    setError(getApiErrorMessage(err, fallback));
    setPhase("error");
  };

  const startQuestion = (seconds: number) => {
    const now = Date.now();
    questionStartedAtRef.current = new Date(now).toISOString();
    deadlineRef.current = now + seconds * 1000;
    setSecondsLeft(seconds);
    setSelectedOptionId(null);
  };

  const enterStage = async (
    target: QuizStage,
    stageAttemptId: string,
    seconds: number,
  ) => {
    setPhase("loading");
    let ready = target;
    if (target.status === "pending") await generateStage(quizId, target.id);
    if (target.status !== "ready") ready = await waitForStageReady(target.id);
    const qs = await getStageQuestions(ready.id);

    stageAttemptIdRef.current = stageAttemptId;
    answersRef.current = {};
    setAnswers({});
    setStage({ ...target, ...ready });
    setQuestions(qs);
    setIndex(0);
    startQuestion(seconds);
    setPhase("playing");
  };

  /** Starts or resumes the attempt; the backend decides which stage is current. */
  const startFromServer = async (seconds: number) => {
    setPhase("loading");
    try {
      const start = await startQuiz(quizId);
      attemptIdRef.current = start.attempt.id;
      await enterStage(
        start.stage,
        start.stageAttempt.id,
        start.quiz.time_per_question_seconds ?? seconds,
      );
    } catch (err) {
      fail(err, "Couldn't load your quiz. Please try again.");
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    getQuiz(quizId)
      .then((q) => {
        setQuiz(q);
        return startFromServer(q.time_per_question_seconds);
      })
      .catch((err) => fail(err, "Couldn't load your quiz. Please try again."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const recordAnswer = (questionId: string, record: AnswerRecord) => {
    answersRef.current = { ...answersRef.current, [questionId]: record };
    setAnswers(answersRef.current);
  };

  const finishStage = async () => {
    if (!quiz || !stage || !attemptIdRef.current || !stageAttemptIdRef.current)
      return;
    setPhase("finishing");
    try {
      const res = await completeStage(stage.id, {
        quizAttemptId: attemptIdRef.current,
        stageAttemptId: stageAttemptIdRef.current,
      });

      const records = Object.values(answersRef.current);
      const graded = records.filter(
        (r) => r.status === "correct" || r.status === "wrong",
      );
      const correct = records.filter((r) => r.status === "correct").length;
      // Prefer the backend's verdict; fall back to the 70% rule when the
      // answers were graded, and to "passed" when we have no grading at all.
      const passed =
        res.passed ??
        (graded.length > 0
          ? correct / questions.length >= PASS_RATIO
          : true);

      if (!passed) {
        setPhase("stage-failed");
        return;
      }

      if (stageIndex >= quiz.stages.length - 1) {
        const done = await completeQuiz(quiz.id, {
          quizAttemptId: attemptIdRef.current,
        });
        const best = await getMyBest().catch(() => null);
        setCompletion({ ...done, level: best?.level });
        setPhase("completed");
        return;
      }

      nextStageRef.current = res.nextStageAttempt
        ? {
            stage: res.nextStage ?? quiz.stages[stageIndex + 1],
            attemptId: res.nextStageAttempt.id,
          }
        : null;
      setPhase("stage-passed");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't finish this stage."));
      setPhase("revealing");
    }
  };

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      startQuestion(timePerQuestion);
      setPhase("playing");
    } else {
      void finishStage();
    }
  };

  const submit = async (timedOut = false) => {
    const question = questions[index];
    if (
      !question ||
      phase !== "playing" ||
      !attemptIdRef.current ||
      !stageAttemptIdRef.current ||
      !stage
    )
      return;
    if (!selectedOptionId && !timedOut) return;

    setPhase("submitting");
    const base = {
      quizAttemptId: attemptIdRef.current,
      stageAttemptId: stageAttemptIdRef.current,
      questionStartedAt: questionStartedAtRef.current,
    };
    try {
      const result = await answerQuestion(
        question.id,
        selectedOptionId
          ? { ...base, status: "answered", selectedOptionId }
          : { ...base, status: "skipped" },
      );
      const isCorrect =
        result.isCorrect ??
        (result.correctOptionId && selectedOptionId
          ? result.correctOptionId === selectedOptionId
          : undefined);

      recordAnswer(question.id, {
        status: !selectedOptionId
          ? "skipped"
          : isCorrect === undefined
            ? "answered"
            : isCorrect
              ? "correct"
              : "wrong",
        selectedOptionId: selectedOptionId ?? undefined,
        result,
      });
      setPoints(
        (p) =>
          p + (result.pointsAwarded ?? (isCorrect ? STAGE_POINTS[stage.difficulty] : 0)),
      );

      const canReveal =
        result.isCorrect !== undefined || result.correctOptionId !== undefined;
      if (canReveal) setPhase("revealing");
      else goNext();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't submit your answer."));
      setPhase("playing");
    }
  };

  // Keep the latest submit for the timer callback.
  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  });

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const remaining = (deadlineRef.current - Date.now()) / 1000;
      setSecondsLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        clearInterval(id);
        void submitRef.current(true);
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase, index]);

  const continueToNextStage = async () => {
    const next = nextStageRef.current;
    nextStageRef.current = null;
    if (next?.stage) {
      try {
        await enterStage(next.stage, next.attemptId, timePerQuestion);
      } catch (err) {
        fail(err, "Couldn't load the next stage.");
      }
    } else {
      await startFromServer(timePerQuestion);
    }
  };

  const retry = useCallback(
    () => startFromServer(timePerQuestion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timePerQuestion],
  );

  const statuses: NavStatus[] = questions.map((q, i) => {
    const record = answers[q.id];
    if (record) return record.status;
    return i === index && phase !== "stage-passed" ? "current" : "upcoming";
  });

  return {
    phase,
    error,
    quiz,
    stage,
    stageIndex,
    questions,
    question: questions[index] ?? null,
    index,
    selectedOptionId,
    selectOption: setSelectedOptionId,
    currentAnswer: questions[index] ? answers[questions[index].id] : undefined,
    statuses,
    points,
    secondsLeft,
    timePerQuestion,
    completion,
    submit: () => submit(false),
    next: goNext,
    continueToNextStage,
    retry,
  };
}
