import type { ReviewQuestion } from "@/api/quizzes";
import type { NavStatus } from "@/components/challenge/QuizSidebar";
import type { TopicLoss } from "./StageResultCard";

export type Outcome = Extract<
  NavStatus,
  "correct" | "wrong" | "skipped" | "answered"
>;

/** Correctness of a reviewed question, falling back to option ids when the flag is missing. */
export const reviewOutcome = (q: ReviewQuestion): Outcome => {
  if (q.status === "skipped") return "skipped";
  if (q.isCorrect !== undefined) return q.isCorrect ? "correct" : "wrong";
  if (q.correctOptionId && q.selectedOptionId) {
    return q.correctOptionId === q.selectedOptionId ? "correct" : "wrong";
  }
  return q.selectedOptionId ? "answered" : "skipped";
};

export const isMistake = (o: Outcome) => o === "wrong" || o === "skipped";

/** Marks lost per topic, largest first. */
export const topicLosses = (
  items: { topic: string; outcome: Outcome; points: number }[],
): TopicLoss[] => {
  const byTopic = new Map<string, number>();
  for (const { topic, outcome, points } of items) {
    if (!isMistake(outcome)) continue;
    byTopic.set(topic, (byTopic.get(topic) ?? 0) + points);
  }
  return [...byTopic]
    .map(([topic, marks]) => ({ topic, marks }))
    .sort((a, b) => b.marks - a.marks);
};
