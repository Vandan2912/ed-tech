import { api } from "@/lib/api";

export type PersonalDetailsPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
};

export type AcademicDetailsPayload = {
  schoolName: string;
  courseOrStandard: string;
  district: string;
  state: string;
  pincode: string;
};

/** Onboarding step 1 — personal details. Auth token is attached by the api interceptor. */
export const savePersonalDetails = async (data: PersonalDetailsPayload) => {
  const res = await api.post("/api/v2/onboarding/personal", data);
  return res.data;
};

/** Onboarding step 2 — academic details. */
export const saveOnboardingAcademicDetails = async (
  data: AcademicDetailsPayload,
) => {
  const res = await api.post("/api/v2/onboarding/academic", data);
  return res.data;
};

/* ---------------- Goals & subjects ---------------- */

export type OnboardingGoal = {
  id: string;
  title: string;
  description: string;
};

export type OnboardingSubject = {
  /** Always the subject's ai_subject_id — this is what /subjects/select expects. */
  id: string;
  name: string;
};

type RawRecord = Record<string, unknown>;

/** Unwraps `{ data: [...] }` / `{ data: { goals: [...] } }` style responses into an array. */
const toList = (body: unknown, key: string): RawRecord[] => {
  const candidates = [
    body,
    (body as RawRecord)?.data,
    (body as RawRecord)?.[key],
    ((body as RawRecord)?.data as RawRecord)?.[key],
  ];
  return (candidates.find(Array.isArray) as RawRecord[]) ?? [];
};

const str = (...values: unknown[]) =>
  String(values.find((v) => v !== undefined && v !== null) ?? "");

export const getOnboardingGoals = async (): Promise<OnboardingGoal[]> => {
  const res = await api.get("/api/v2/onboarding/goals");
  return toList(res.data, "goals").map((g) => ({
    id: str(g.id, g.goal_id, g.goalId),
    title: str(g.title, g.name, g.goal_name),
    description: str(g.description, g.goal_description),
  }));
};

export const setOnboardingGoal = async (data: {
  goalId: string | null;
  goalDescription: string;
}) => {
  const res = await api.post("/api/v2/onboarding/goals", data);
  return res.data;
};

export const getOnboardingSubjects = async (): Promise<OnboardingSubject[]> => {
  const res = await api.get("/api/v2/onboarding/subjects");
  return toList(res.data, "subjects")
    .map((s) => ({
      id: str(s.ai_subject_id, s.aiSubjectId),
      name: str(s.name, s.subject_name, s.subjectName, s.title),
    }))
    .filter((s) => s.id);
};

export const selectOnboardingSubjects = async (subjectIds: string[]) => {
  const res = await api.post("/api/v2/onboarding/subjects/select", {
    subjectIds,
  });
  return res.data;
};
