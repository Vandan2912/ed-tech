import { api } from "@/lib/api";

export interface Alert {
  type: "inactive" | "failed";
  userId: string;
  studentName: string;
  profilePicture: string;
  class: string;
  daysInactive: number | null;
  lastActiveDate: string | null;
  isReminded: boolean;
  isDismissed: boolean;
  quizId: number | null;
}

export interface AlertsSummary {
  totalAlerts: number;
  inactiveCount: number;
  failedTwiceCount: number;
}

export interface AlertsResponse {
  summary: AlertsSummary;
  alerts: Alert[];
}

interface ApiAlert {
  type: string;
  user_id: string;
  student_name: string;
  profile_picture: string;
  class: string;
  days_inactive: number | null;
  last_active_date: string | null;
  is_reminded: boolean;
  is_dismissed: boolean;
  quiz_id: number | null;
}

interface ApiAlertsResponse {
  success: boolean;
  summary: {
    total_alerts: number;
    inactive_count: number;
    failed_twice_count: number;
  };
  alerts: ApiAlert[];
}

function toApiAlertType(type: "inactive" | "failed"): string {
  return type === "failed" ? "failed_twice" : "inactive";
}

export const getAlerts = async (): Promise<AlertsResponse> => {
  const token = localStorage.getItem("token");
  const res = await api.get<ApiAlertsResponse>("/alerts", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { summary, alerts } = res.data;
  return {
    summary: {
      totalAlerts: summary.total_alerts,
      inactiveCount: summary.inactive_count,
      failedTwiceCount: summary.failed_twice_count,
    },
    alerts: alerts.map((a) => ({
      type: a.type === "failed_twice" ? "failed" : "inactive",
      userId: a.user_id,
      studentName: a.student_name,
      profilePicture: a.profile_picture,
      class: a.class,
      daysInactive: a.days_inactive,
      lastActiveDate: a.last_active_date,
      isReminded: a.is_reminded,
      isDismissed: a.is_dismissed,
      quizId: a.quiz_id,
    })),
  };
};

export const sendReminder = async (payload: {
  studentId: string;
  alertType: "inactive" | "failed";
  quizId: number | null;
}): Promise<void> => {
  const token = localStorage.getItem("token");
  await api.post(
    "/alerts/remind",
    {
      student_id: payload.studentId,
      alert_type: toApiAlertType(payload.alertType),
      quiz_id: payload.quizId,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const dismissAlert = async (payload: {
  studentId: string;
  alertType: "inactive" | "failed";
  quizId: number | null;
}): Promise<void> => {
  const token = localStorage.getItem("token");
  await api.post(
    "/alerts/dismiss",
    {
      student_id: payload.studentId,
      alert_type: toApiAlertType(payload.alertType),
      quiz_id: payload.quizId,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
