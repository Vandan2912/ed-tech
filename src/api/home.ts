import { api } from "@/lib/api";

export interface ContinueLearningItem {
  subject_id: number;
  subject_name: string;
  icon: string;
  progress_percent: number;
}

export interface HomeProgressSummary {
  courses_completed: number;
  certificates_earned: number;
  global_rank: number;
}

export interface CognitiveMetrics {
  efficiency: string;
  hours_learned: number;
}

export interface HomeOverview {
  continue_learning: ContinueLearningItem[];
  progress_summary: HomeProgressSummary;
  cognitive_metrics: CognitiveMetrics;
}

export const getHomeOverview = async (): Promise<HomeOverview> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/home/overview", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
