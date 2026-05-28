import { api } from "@/lib/api";

export type ErrorPatternStatus = "critical" | "improving" | "fixed";

export interface StatsErrorPattern {
  topicId: number;
  topicName: string;
  occurrences: number;
  status: ErrorPatternStatus;
}

export interface StatsSubjectProgress {
  name: string;
  progress: number;
}

export interface StatsHistoricalPoint {
  name: string;
  load: number;
  pressure: number;
}

export interface StatsKeyMetrics {
  studyTime: string;
  accuracy: string;
  cognitivePeak: string | null;
}

export interface StatsData {
  misconceptionPoints: number;
  correctionStreak: number;
  errorPatterns: StatsErrorPattern[];
  subjectProgress: StatsSubjectProgress[];
  keyMetrics: StatsKeyMetrics;
  historicalLoadAnalysis: StatsHistoricalPoint[];
  aiSuggestion: string;
}

interface ApiStatsResponse {
  success: boolean;
  data: {
    misconception_points: number;
    correction_streak: { fixed_count: number };
    error_patterns: {
      topic_id: number;
      topic_name: string;
      occurrences: number;
      status: ErrorPatternStatus;
    }[];
    subject_progress: { subject?: string; name?: string; progress: number }[];
    key_metrics: {
      study_time: string;
      accuracy: string;
      cognitive_peak: string | null;
    };
    historical_load_analysis: {
      topic_name: string;
      load: number;
      pressure: number;
    }[];
    ai_suggestion: string;
  };
}

export const getStats = async (): Promise<StatsData> => {
  const res = await api.get<ApiStatsResponse>("/stats");
  const d = res.data.data;

  return {
    misconceptionPoints: d.misconception_points ?? 0,
    correctionStreak: d.correction_streak?.fixed_count ?? 0,
    errorPatterns: (d.error_patterns ?? []).map((e) => ({
      topicId: e.topic_id,
      topicName: e.topic_name,
      occurrences: e.occurrences,
      status: e.status,
    })),
    subjectProgress: (d.subject_progress ?? []).map((s) => ({
      name: s.name ?? s.subject ?? "",
      progress: s.progress,
    })),
    keyMetrics: {
      studyTime: d.key_metrics?.study_time ?? "0h",
      accuracy: d.key_metrics?.accuracy ?? "0%",
      cognitivePeak: d.key_metrics?.cognitive_peak ?? null,
    },
    historicalLoadAnalysis: (d.historical_load_analysis ?? []).map((h) => ({
      name: h.topic_name,
      load: h.load,
      pressure: h.pressure,
    })),
    aiSuggestion: d.ai_suggestion ?? "",
  };
};
