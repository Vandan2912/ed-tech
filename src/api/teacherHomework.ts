import { api } from "@/lib/api";

export type HomeworkStatus = "ACTIVE" | "CLOSED";

export interface TeacherHomework {
  id: number;
  title: string;
  subject: string;
  class: string;
  due_date: string;
  created_at: string;
  total_questions: number;
  total_points: number;
  total_students: number;
  submissions_count: number;
  status: HomeworkStatus;
}

export interface TeacherHomeworksSummary {
  totalAssignments: number;
  activeCount: number;
}

export interface TeacherHomeworksResponse {
  summary: TeacherHomeworksSummary;
  homeworks: TeacherHomework[];
}

export const getTeacherHomeworks = async (): Promise<TeacherHomeworksResponse> => {
  const res = await api.get("/teacher/homeworks");
  return res.data;
};

export type QuestionType = "MCQ" | "WRITTEN";

export interface CreateHomeworkQuestion {
  type: QuestionType;
  question: string;
  points: number;
  options?: string[];
  correct_option_indexes?: number[];
}

export interface CreateHomeworkPayload {
  title: string;
  standard: string;
  subject: string;
  due_date: string;
  questions: CreateHomeworkQuestion[];
}

export const createTeacherHomework = async (
  payload: CreateHomeworkPayload,
): Promise<TeacherHomework> => {
  const res = await api.post("/teacher/homework", payload);
  return res.data;
};

export interface SubmissionAnswer {
  question_id: number;
  question: string;
  type: QuestionType;
  student_answer: string;
  correct_answer: string | null;
  max_points: number;
  awarded_points: number | null;
}

export interface RectificationEntry {
  from_score: number;
  to_score: number;
  justification: string;
  rectified_at: string;
}

export interface HomeworkSubmission {
  submission_id: number;
  student_id: string;
  student_name: string;
  profile_picture: string | null;
  submitted_at: string;
  is_late: boolean;
  answers: SubmissionAnswer[];
  final_score: number | null;
  total_points: number;
  graded_at: string | null;
  rectifications: RectificationEntry[];
}

export interface HomeworkSubmissionsResponse {
  homework: {
    id: number;
    title: string;
    subject: string;
    class: string;
    total_students: number;
    total_submitted: number;
  };
  pending: HomeworkSubmission[];
  graded: HomeworkSubmission[];
}

export const getTeacherHomeworkSubmissions = async (
  homeworkId: number,
): Promise<HomeworkSubmissionsResponse> => {
  const res = await api.get(`/teacher/homework/${homeworkId}/submissions`);
  return res.data;
};

export interface GradeSubmissionPayload {
  scores: { question_id: number; points: number }[];
}

export const gradeHomeworkSubmission = async (
  homeworkId: number,
  submissionId: number,
  payload: GradeSubmissionPayload,
): Promise<HomeworkSubmission> => {
  const res = await api.post(
    `/teacher/homework/${homeworkId}/submissions/${submissionId}/grade`,
    payload,
  );
  return res.data;
};

export interface RectifyGradePayload {
  new_score: number;
  justification: string;
}

export const rectifyHomeworkGrade = async (
  homeworkId: number,
  submissionId: number,
  payload: RectifyGradePayload,
): Promise<HomeworkSubmission> => {
  const res = await api.post(
    `/teacher/homework/${homeworkId}/submissions/${submissionId}/rectify`,
    payload,
  );
  return res.data;
};
