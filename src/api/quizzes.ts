import { api } from "@/lib/api";

/* ---------------- Types (from v2 sample responses) ---------------- */

export type Difficulty = "easy" | "medium" | "hard";
export type StageStatus = "pending" | "generating" | "ready" | (string & {});

export type QuizStage = {
  id: string;
  difficulty: Difficulty;
  displayOrder: number;
  questionCount: number;
  status?: StageStatus;
};

export type Quiz = {
  id: string;
  topic_name: string;
  description: string;
  source_type: "topic" | "file";
  status: string;
  time_per_question_seconds: number;
  created_at: string;
  stages: QuizStage[];
};

export type QuizListItem = Omit<Quiz, "stages"> & {
  stage_count: number;
  attempt_count: number;
};

export type QuizSource = {
  id: string;
  quiz_id: string;
  source_type: "file";
  original_file_name: string;
  mime_type: string;
  file_size_bytes: string;
  processing_status: string;
};

export type QuizOption = {
  id: string;
  optionKey: string;
  optionText: string;
  displayOrder: number;
};

export type QuizQuestion = {
  id: string;
  displayOrder: number;
  questionText: string;
  questionType: string;
  topicName: string;
  options: QuizOption[];
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  attempt_number: number;
  status: string;
};

export type StageAttempt = {
  id: string;
  quiz_attempt_id: string;
  stage_id: string;
  attempt_number: number;
  status: string;
};

export type StartQuizResult = {
  quiz: Omit<Quiz, "stages" | "created_at">;
  attempt: QuizAttempt;
  stage: QuizStage;
  stageAttempt: StageAttempt;
  resumed: boolean;
};

// No sample responses yet for answer / stage-complete / quiz-complete — every
// field is optional and the UI degrades when a field is missing.
export type AnswerResult = {
  isCorrect?: boolean;
  correctOptionId?: string;
  pointsAwarded?: number;
  /** optionId → percentage of learners who picked it */
  optionPercentages?: Record<string, number>;
};

export type StageCompleteResult = {
  passed?: boolean;
  score?: number;
  nextStage?: QuizStage;
  nextStageAttempt?: StageAttempt;
};

export type QuizCompleteResult = {
  totalPoints?: number;
  badge?: { name?: string; description?: string };
};

export type RetryStageResult = {
  stage?: QuizStage;
  stageAttempt?: StageAttempt;
};

export type ReviewQuestion = QuizQuestion & {
  difficulty?: Difficulty;
  status?: string;
  selectedOptionId?: string;
  correctOptionId?: string;
  isCorrect?: boolean;
  mistakeTag?: string | null;
  explanation?: string;
};

export type AttemptReview = {
  quiz?: { id?: string; topic_name?: string; description?: string };
  attempt?: QuizAttempt;
  questions: ReviewQuestion[];
};

export type QuestionStatistics = {
  /** optionId → percentage of learners who picked it */
  optionPercentages?: Record<string, number>;
  totalAttempts?: number;
  correctRate?: number;
};

export type AiAction = "show_steps" | (string & {});

export type AiJob = {
  status: string;
  result?: string;
};

/* ---------------- Helpers ---------------- */

type Envelope<T> = { success: boolean; message?: string; data: T };
type RawRecord = Record<string, unknown>;

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

/** Stages come back snake_case from most endpoints but camelCase from GET /quizzes/:id. */
export const normalizeStage = (raw: RawRecord): QuizStage => ({
  id: String(raw.id),
  difficulty: raw.difficulty as Difficulty,
  displayOrder: Number(
    raw.display_order ??
      raw.displayOrder ??
      DIFFICULTY_ORDER.indexOf(raw.difficulty as Difficulty) + 1,
  ),
  questionCount: Number(raw.question_count ?? raw.questionCount ?? 0),
  status: raw.status as StageStatus | undefined,
});

const sortStages = (stages: RawRecord[] = []) =>
  stages.map(normalizeStage).sort((a, b) => a.displayOrder - b.displayOrder);

const pick = <T>(obj: RawRecord | undefined, ...keys: string[]): T | undefined => {
  for (const k of keys) if (obj?.[k] !== undefined) return obj[k] as T;
  return undefined;
};

const logShape = (label: string, data: unknown) => {
  if (import.meta.env.DEV) console.info(`[quizzes] ${label} response`, data);
};

/* ---------------- Quizzes ---------------- */

export const createQuiz = async (body: {
  topicName: string;
  description: string;
  sourceType: "topic" | "file";
  timePerQuestionSeconds: number;
}): Promise<Quiz> => {
  const res = await api.post<Envelope<RawRecord>>("/api/v2/quizzes", body);
  const quiz = res.data.data;
  return { ...(quiz as Quiz), stages: sortStages(quiz.stages as RawRecord[]) };
};

export const getQuiz = async (quizId: string): Promise<Quiz> => {
  const res = await api.get<Envelope<RawRecord>>(`/api/v2/quizzes/${quizId}`);
  const quiz = res.data.data;
  return { ...(quiz as Quiz), stages: sortStages(quiz.stages as RawRecord[]) };
};

export const listQuizzes = async (): Promise<QuizListItem[]> => {
  const res = await api.get<Envelope<QuizListItem[]>>("/api/v2/quizzes/");
  return res.data.data;
};

/* ---------------- Sources ---------------- */

export const uploadQuizSource = async (
  quizId: string,
  file: File,
): Promise<QuizSource> => {
  const form = new FormData();
  form.append("sourceType", "file");
  form.append("file", file);
  // The shared instance defaults to JSON, which would make axios serialise the
  // FormData as JSON — force multipart so the browser sets the boundary.
  const res = await api.post<Envelope<QuizSource>>(
    `/api/v2/quizzes/${quizId}/sources`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data.data;
};

export const getQuizSources = async (quizId: string): Promise<QuizSource[]> => {
  const res = await api.get<Envelope<QuizSource[]>>(
    `/api/v2/quizzes/${quizId}/sources`,
  );
  return res.data.data;
};

export const deleteQuizSource = async (quizId: string, sourceId: string) => {
  const res = await api.delete<Envelope<QuizSource>>(
    `/api/v2/quizzes/${quizId}/sources/${sourceId}`,
  );
  return res.data.data;
};

/* ---------------- Stages & questions ---------------- */

export const getStages = async (quizId: string): Promise<QuizStage[]> => {
  const res = await api.get<Envelope<RawRecord[]>>(
    `/api/v2/quizzes/${quizId}/stages`,
  );
  return sortStages(res.data.data);
};

/** Kicks off async question generation; poll getStage until status is "ready". */
export const generateStage = async (quizId: string, stageId: string) => {
  const res = await api.post<Envelope<{ stage: RawRecord }>>(
    `/api/v2/quizzes/${quizId}/stages/${stageId}/generate`,
  );
  return normalizeStage(res.data.data.stage);
};

export const getStage = async (stageId: string): Promise<QuizStage> => {
  const res = await api.get<Envelope<{ stage: RawRecord }>>(
    `/api/v2/quizzes/stages/${stageId}`,
  );
  return normalizeStage(res.data.data.stage);
};

/** Polls a stage until its questions are generated. */
export const waitForStageReady = async (
  stageId: string,
  { intervalMs = 2000, timeoutMs = 90_000 } = {},
): Promise<QuizStage> => {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const stage = await getStage(stageId);
    if (stage.status === "ready") return stage;
    if (stage.status === "failed") {
      throw new Error("Question generation failed. Please try again.");
    }
    if (Date.now() > deadline) {
      throw new Error("Generating questions is taking too long. Try again.");
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
};

export const getStageQuestions = async (
  stageId: string,
): Promise<QuizQuestion[]> => {
  const res = await api.get<Envelope<{ questions: QuizQuestion[] }>>(
    `/api/v2/quizzes/stages/${stageId}/questions`,
  );
  return [...res.data.data.questions]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((q) => ({
      ...q,
      options: [...q.options].sort((a, b) => a.displayOrder - b.displayOrder),
    }));
};

export const getQuestion = async (questionId: string): Promise<QuizQuestion> => {
  const res = await api.get<Envelope<QuizQuestion>>(
    `/api/v2/quizzes/questions/${questionId}`,
  );
  return res.data.data;
};

/* ---------------- Attempts ---------------- */

/** Starts (or resumes) an attempt; returns the stage the learner is currently on. */
export const startQuiz = async (quizId: string): Promise<StartQuizResult> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/${quizId}/start`,
  );
  const data = res.data.data;
  return {
    ...(data as unknown as StartQuizResult),
    stage: normalizeStage(data.stage as RawRecord),
  };
};

export const answerQuestion = async (
  questionId: string,
  body: {
    quizAttemptId: string;
    stageAttemptId: string;
    questionStartedAt: string;
  } & (
    | { status: "answered"; selectedOptionId: string }
    | { status: "skipped" }
  ),
): Promise<AnswerResult> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/questions/${questionId}/answer`,
    body,
  );
  const data = res.data.data ?? {};
  logShape("answer", data);
  const answer = (pick<RawRecord>(data, "answer") ?? data) as RawRecord;
  return {
    isCorrect: pick(answer, "isCorrect", "is_correct", "correct"),
    correctOptionId: pick(answer, "correctOptionId", "correct_option_id"),
    pointsAwarded: pick(answer, "pointsAwarded", "points_awarded", "points"),
    optionPercentages: pick(
      answer,
      "optionPercentages",
      "option_percentages",
    ),
  };
};

export const completeStage = async (
  stageId: string,
  body: { quizAttemptId: string; stageAttemptId: string },
): Promise<StageCompleteResult> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/stages/${stageId}/complete`,
    body,
  );
  const data = res.data.data ?? {};
  logShape("stage complete", data);
  const stageAttempt = pick<RawRecord>(data, "stageAttempt", "stage_attempt");
  const nextStage = pick<RawRecord>(data, "nextStage", "next_stage");
  const status = pick<string>(stageAttempt, "status") ?? pick(data, "status");
  return {
    passed:
      pick(data, "passed", "isPassed", "is_passed") ??
      pick(stageAttempt, "passed", "is_passed") ??
      (status === "passed" ? true : status === "failed" ? false : undefined),
    score: pick(data, "score", "points") ?? pick(stageAttempt, "score"),
    nextStage: nextStage ? normalizeStage(nextStage) : undefined,
    nextStageAttempt: pick(data, "nextStageAttempt", "next_stage_attempt"),
  };
};

export const completeQuiz = async (
  quizId: string,
  body: { quizAttemptId: string },
): Promise<QuizCompleteResult> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/${quizId}/complete`,
    body,
  );
  const data = res.data.data ?? {};
  logShape("quiz complete", data);
  return {
    totalPoints: pick(data, "totalPoints", "total_points", "points"),
    badge: pick(data, "badge"),
  };
};

/** Starts a fresh attempt at a stage the learner failed. */
export const retryStage = async (
  stageId: string,
  body: { quizAttemptId: string },
): Promise<RetryStageResult> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/stages/${stageId}/retry`,
    body,
  );
  const data = res.data.data ?? {};
  logShape("stage retry", data);
  const stage = pick<RawRecord>(data, "stage");
  return {
    stage: stage ? normalizeStage(stage) : undefined,
    stageAttempt:
      pick(data, "stageAttempt", "stage_attempt") ??
      // Some endpoints return the stage attempt itself as `data`.
      (pick(data, "quiz_attempt_id") ? (data as unknown as StageAttempt) : undefined),
  };
};

/* ---------------- Review ---------------- */

/** Accepts either an `optionId → %` map or a list of `{ optionId, percentage }`. */
const normalizePercentages = (
  raw: unknown,
): Record<string, number> | undefined => {
  if (!raw) return undefined;
  if (!Array.isArray(raw)) return raw as Record<string, number>;
  return Object.fromEntries(
    (raw as RawRecord[]).map((o) => [
      String(pick(o, "optionId", "option_id", "id")),
      Number(pick(o, "percentage", "percent", "pct") ?? 0),
    ]),
  );
};

const normalizeReviewQuestion = (raw: RawRecord): ReviewQuestion => {
  const answer = pick<RawRecord>(raw, "answer", "userAnswer", "user_answer");
  const from = <T>(...keys: string[]) =>
    pick<T>(raw, ...keys) ?? pick<T>(answer, ...keys);
  const options = (pick<RawRecord[]>(raw, "options") ?? []).map((o) => ({
    id: String(o.id),
    optionKey: String(pick(o, "optionKey", "option_key") ?? ""),
    optionText: String(pick(o, "optionText", "option_text") ?? ""),
    displayOrder: Number(pick(o, "displayOrder", "display_order") ?? 0),
    isCorrect: pick<boolean>(o, "isCorrect", "is_correct"),
  }));
  return {
    id: String(pick(raw, "questionId", "question_id", "id")),
    displayOrder: Number(pick(raw, "displayOrder", "display_order") ?? 0),
    questionText: String(pick(raw, "questionText", "question_text") ?? ""),
    questionType: String(pick(raw, "questionType", "question_type") ?? ""),
    topicName: String(pick(raw, "topicName", "topic_name") ?? ""),
    options: options
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(({ id, optionKey, optionText, displayOrder }) => ({
        id,
        optionKey,
        optionText,
        displayOrder,
      })),
    difficulty: from("difficulty"),
    status: from("status"),
    selectedOptionId: from("selectedOptionId", "selected_option_id"),
    correctOptionId:
      from("correctOptionId", "correct_option_id") ??
      options.find((o) => o.isCorrect)?.id,
    isCorrect: from("isCorrect", "is_correct"),
    mistakeTag: from("mistakeTag", "mistake_tag"),
    explanation: from("explanation"),
  };
};

export const getAttemptReview = async (
  quizAttemptId: string,
): Promise<AttemptReview> => {
  const res = await api.get<Envelope<RawRecord>>(
    `/api/v2/quizzes/review/attempts/${quizAttemptId}`,
  );
  const data = res.data.data ?? {};
  logShape("attempt review", data);
  // Questions may be flat or grouped per stage.
  const stages = pick<RawRecord[]>(data, "stages") ?? [];
  const flat =
    pick<RawRecord[]>(data, "questions") ??
    stages.flatMap((s) =>
      (pick<RawRecord[]>(s, "questions") ?? []).map((q) => ({
        difficulty: s.difficulty,
        ...q,
      })),
    );
  return {
    quiz: pick(data, "quiz"),
    attempt: pick(data, "attempt", "quizAttempt", "quiz_attempt"),
    questions: flat.map(normalizeReviewQuestion),
  };
};

// ASSUMPTION: body shape for the mistake-tag PATCH hasn't been shared yet.
export const tagMistake = async (
  questionId: string,
  body: { quizAttemptId: string; mistakeTag: string | null },
) => {
  const res = await api.patch<Envelope<RawRecord>>(
    `/api/v2/quizzes/review/questions/${questionId}`,
    body,
  );
  logShape("mistake tag", res.data.data);
  return res.data.data;
};

export const getQuestionStatistics = async (
  questionId: string,
): Promise<QuestionStatistics> => {
  const res = await api.get<Envelope<RawRecord>>(
    `/api/v2/quizzes/review/questions/${questionId}/statistics`,
  );
  const data = res.data.data ?? {};
  logShape("question statistics", data);
  return {
    optionPercentages: normalizePercentages(
      pick(data, "optionPercentages", "option_percentages", "options"),
    ),
    totalAttempts: pick(data, "totalAttempts", "total_attempts"),
    correctRate: pick(data, "correctRate", "correct_rate", "accuracy"),
  };
};

/* ---------------- Ask AI ---------------- */

/** Queues an AI tutor job; poll waitForJob for the answer. */
export const askAi = async (body: {
  questionId: string;
  quizAttemptId: string;
  conversationType: "ai_tutor";
  action: AiAction;
}): Promise<{ jobId: string }> => {
  const res = await api.post<Envelope<RawRecord>>("/api/v2/quizzes/ask", body);
  const data = res.data.data ?? {};
  logShape("ask ai", data);
  const job = pick<RawRecord>(data, "job");
  return {
    jobId: String(
      pick(data, "jobId", "job_id") ?? pick(job, "id") ?? pick(data, "id"),
    ),
  };
};

export const getJob = async (
  jobId: string,
  body: { quizAttemptId: string; stageAttemptId?: string },
): Promise<AiJob> => {
  const res = await api.post<Envelope<RawRecord>>(
    `/api/v2/quizzes/jobs/${jobId}`,
    body,
  );
  const data = res.data.data ?? {};
  const job = (pick<RawRecord>(data, "job") ?? data) as RawRecord;
  const result = pick<unknown>(job, "result", "response", "answer", "output");
  return {
    status: String(pick(job, "status") ?? (result ? "completed" : "pending")),
    result:
      result === undefined || typeof result === "string"
        ? (result as string | undefined)
        : String(
            pick(result as RawRecord, "text", "content", "message", "answer") ??
              JSON.stringify(result),
          ),
  };
};

/** Polls an AI job until it has a result. */
export const waitForJob = async (
  jobId: string,
  body: { quizAttemptId: string; stageAttemptId?: string },
  { intervalMs = 2000, timeoutMs = 60_000 } = {},
): Promise<string> => {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const job = await getJob(jobId, body);
    if (job.result && job.status !== "failed") return job.result;
    if (job.status === "failed") {
      throw new Error("The AI tutor couldn't answer. Please try again.");
    }
    if (Date.now() > deadline) {
      throw new Error("The AI tutor is taking too long. Try again.");
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
};
