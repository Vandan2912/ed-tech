import { api } from "@/lib/api";

export interface ApiProgressTopic {
  topic_id: number;
  topic_name: string;
  subject: string;
  mastery: number;
  status: "MASTERED" | "IN_PROGRESS" | "NEEDS_WORK" | "NOT_STARTED";
}

interface ApiProgressSummaryResponse {
  success: boolean;
  data: {
    overall_mastery: number;
    counts: {
      mastered: number;
      in_progress: number;
      needs_work: number;
      not_started: number;
    };
    topics: ApiProgressTopic[];
  };
}

export interface ProgressTopic {
  id: string;
  category: string;
  title: string;
  status: "mastered" | "in-progress" | "needs-work" | "not-started";
  percentage: number;
  attempts?: number;
  lastStudied?: string;
}

export interface ProgressSummary {
  overallMastery: number;
  counts: {
    mastered: number;
    inProgress: number;
    needsWork: number;
    notStarted: number;
  };
  topics: ProgressTopic[];
}

const STATUS_MAP: Record<ApiProgressTopic["status"], ProgressTopic["status"]> =
  {
    MASTERED: "mastered",
    IN_PROGRESS: "in-progress",
    NEEDS_WORK: "needs-work",
    NOT_STARTED: "not-started",
  };

export interface AnalyticsData {
  weeklyActivity: { day: string; val: number }[];
  subjectMastery: { name: string; mastery: number }[];
  xpGrowth: { week: string; xp: number }[];
}

export const getProgressAnalytics = async (): Promise<AnalyticsData> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/progress/analytics", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { weekly_activity, subject_mastery, xp_growth } = res?.data?.data;

  return {
    weeklyActivity: weekly_activity.map((d: { day: string; value: number }) => ({
      day: d.day,
      val: d.value,
    })),
    subjectMastery: subject_mastery.map((d: { subject: string; value: number }) => ({
      name: d.subject,
      mastery: d.value,
    })),
    xpGrowth: (xp_growth as { label: string; xp: number }[]).map((d, i) => ({
      week: d.label ?? `Week ${i + 1}`,
      xp: d.xp,
    })),
  };
};

export interface Certificate {
  topic: string;
  subject: string;
  score: number;
  date: string;
  distinction: boolean;
}

export const getCertificates = async (): Promise<Certificate[]> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/progress/certificates", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res?.data?.data?.certificates ?? [];
};

export const getProgressSummary = async (): Promise<ProgressSummary> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/progress/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body: ApiProgressSummaryResponse = res?.data;
  const { overall_mastery, counts, topics } = body.data;

  return {
    overallMastery: overall_mastery,
    counts: {
      mastered: counts.mastered,
      inProgress: counts.in_progress,
      needsWork: counts.needs_work,
      notStarted: counts.not_started,
    },
    topics: topics.map((t) => ({
      id: String(t.topic_id),
      category: t.subject,
      title: t.topic_name,
      status: STATUS_MAP[t.status],
      percentage: t.mastery,
    })),
  };
};
