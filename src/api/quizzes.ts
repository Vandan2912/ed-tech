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
  stages: Record<Difficulty, number>;
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
