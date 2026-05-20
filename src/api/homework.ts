import { api } from "@/lib/api";

export type EvaluationStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PENDING";

export interface Homework {
  id: number;
  title: string;
  subject: string;
  class: string;
  due_date: string;
  total_questions: number;
  total_points: number;
  is_published: boolean;
  created_at: string;
  teacher_id: string | null;
  status: string | null;
  score: number | null;
  evaluated_at: string | null;
  evaluation_status: EvaluationStatus;
}

export interface HomeworkOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
}

export interface HomeworkQuestion {
  id: number;
  homework_id: number;
  question: string;
  type: "MCQ" | "WRITTEN";
  subject: string | null;
  points: number;
  order_index: number;
  created_at: string;
  question_meta: unknown;
  options: (HomeworkOption | null)[];
  answer: string | null;
}

export interface HomeworkSubmission {
  id: number;
  homework_id: number;
  student_id: string;
  status: string;
  score: number;
  submitted_at: string | null;
  created_at: string;
  evaluated_at: string | null;
}

export interface HomeworkDetail {
  submission: HomeworkSubmission;
  evaluation_status: string;
  questions: HomeworkQuestion[];
}

export const getHomeworks = async (): Promise<Homework[]> => {
  const res = await api.get("/student/homeworks");
  return res.data;
};

export const getHomeworkDetail = async (id: number): Promise<HomeworkDetail> => {
  const res = await api.get(`/student/homework/${id}`);
  return res.data;
};

export type AnswerPayload =
  | { question_id: number; answer: { type: "MCQ"; selected_option_id: number } }
  | { question_id: number; answer: { type: "WRITTEN"; text: string } };

export const saveAnswer = async (
  homeworkId: number,
  payload: AnswerPayload
): Promise<void> => {
  await api.post(`/student/homework/${homeworkId}/answer`, payload);
};

export interface SubmitResult {
  message: string;
  mcq_score: number;
  final_score: number | null;
  evaluation_status: string;
  xp: {
    awarded: boolean;
    xp: number;
    total_xp: number;
    level: number;
    global_streak_updated: boolean;
    current_global_streak: number | null;
  };
}

export const submitHomework = async (homeworkId: number): Promise<SubmitResult> => {
  const res = await api.post(`/student/homework/${homeworkId}/submit`);
  return res.data;
};
