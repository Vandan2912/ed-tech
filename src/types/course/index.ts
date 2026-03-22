export type Topic = {
  name: string;
  time: string;
  level: "Easy" | "Medium" | "Hard";
  slug: string;
  videoUrl: string;
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type Course = {
  name: string;
  topics_count: number;
  icon: keyof typeof import("lucide-react");
  color: string;
  topics: Topic[];
  slug: string;

};