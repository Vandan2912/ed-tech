import type { Difficulty } from "@/api/quizzes";

export const STAGE_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export const STAGE_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/** Fraction of correct answers needed to clear a stage. */
export const PASS_RATIO = 0.7;

/**
 * Fixed stage shape shown on the Practice setup panel. The backend generates
 * the questions; these numbers are display copy that mirrors what it builds.
 */
export const STAGE_CONFIG: Record<
  Difficulty,
  { questions: number; points: number; passScore: number }
> = {
  easy: { questions: 10, points: 2, passScore: 14 },
  medium: { questions: 20, points: 3, passScore: 42 },
  hard: { questions: 40, points: 4, passScore: 112 },
};

/** Points per correct answer. */
export const STAGE_POINTS: Record<Difficulty, number> = {
  easy: STAGE_CONFIG.easy.points,
  medium: STAGE_CONFIG.medium.points,
  hard: STAGE_CONFIG.hard.points,
};

/** Dot / bar colour per stage (Figma stage rows and score cards). */
export const STAGE_COLOR: Record<Difficulty, string> = {
  easy: "#1fc16b",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export const formatClock = (totalSeconds: number) => {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
