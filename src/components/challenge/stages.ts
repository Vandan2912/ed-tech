import type { Difficulty } from "@/api/quizzes";

export const STAGE_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export const STAGE_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/** Points per correct answer — matches the home page "Quiz Structure" copy. */
export const STAGE_POINTS: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

/** Fraction of correct answers needed to clear a stage. */
export const PASS_RATIO = 0.7;

export const formatClock = (totalSeconds: number) => {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
