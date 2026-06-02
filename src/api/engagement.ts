import { api } from "@/lib/api";

export interface EngagementSummary {
  totalStudents: number;
  activeToday: number;
  atRisk: number;
  avgScore: number;
}

export interface WeeklyEngagementPoint {
  name: string;
  active: number;
  inactive: number;
}

export interface EngagementStudent {
  userId: string;
  name: string;
  profilePicture: string | null;
  class: string;
  status: "active" | "inactive";
  lastActiveDate: string | null;
  streak: number;
  avgScore: number;
  timeHours: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface SubjectPerformance {
  subjectId: number;
  subjectName: string;
  topScore: number;
  avgScore: number;
  bottomScore: number;
}

export interface EngagementData {
  summary: EngagementSummary;
  weeklyEngagement: WeeklyEngagementPoint[];
  students: EngagementStudent[];
  subjectPerformance: SubjectPerformance[];
}

interface ApiEngagementResponse {
  success: boolean;
  data: {
    summary: {
      total_students: number;
      active_today: number;
      at_risk: number;
      avg_score: number;
    };
    weekly_engagement: { day: string; active: number; inactive: number }[];
    students: {
      user_id: string;
      student_name: string;
      profile_picture: string | null;
      class: string;
      status: string;
      last_active_date: string | null;
      streak: number;
      avg_score: number;
      time_hours: number;
      risk_level: string;
    }[];
    subject_performance: {
      subject_id: number;
      subject_name: string;
      top_score: number;
      avg_score: number;
      bottom_score: number;
    }[];
  };
}

export const getEngagementDashboard = async (): Promise<EngagementData> => {
  const res = await api.get<ApiEngagementResponse>("/analytics/dashboard");
  const d = res.data.data;

  return {
    summary: {
      totalStudents: d.summary.total_students ?? 0,
      activeToday: d.summary.active_today ?? 0,
      atRisk: d.summary.at_risk ?? 0,
      avgScore: d.summary.avg_score ?? 0,
    },
    weeklyEngagement: (d.weekly_engagement ?? []).map((w) => ({
      name: w.day,
      active: w.active,
      inactive: w.inactive,
    })),
    students: (d.students ?? []).map((s) => ({
      userId: s.user_id,
      name: s.student_name,
      profilePicture: s.profile_picture,
      class: s.class,
      status: (s.status === "active" ? "active" : "inactive") as "active" | "inactive",
      lastActiveDate: s.last_active_date,
      streak: s.streak ?? 0,
      avgScore: s.avg_score ?? 0,
      timeHours: s.time_hours ?? 0,
      riskLevel: (s.risk_level ?? "low") as EngagementStudent["riskLevel"],
    })),
    subjectPerformance: (d.subject_performance ?? []).map((sp) => ({
      subjectId: sp.subject_id,
      subjectName: sp.subject_name,
      topScore: sp.top_score,
      avgScore: sp.avg_score,
      bottomScore: sp.bottom_score,
    })),
  };
};
