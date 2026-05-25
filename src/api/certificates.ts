import { api } from "@/lib/api";

export type CertificateStatus = "certified" | "pending";

export interface SubjectCertificate {
  subjectId: number;
  subject: string;
  iconFile: string;
  completedTopics: number;
  totalTopics: number;
  progressPercent: number;
  status: CertificateStatus;
  grade: string | null;
  remainingTopics: number;
  /** Issue date — only present once a subject is certified. */
  date: string | null;
}

export interface CertificatesSummary {
  certified: number;
  pending: number;
  topicsCompleted: number;
}

export interface CertificatesResponse {
  summary: CertificatesSummary;
  certificates: SubjectCertificate[];
}

interface ApiCertificate {
  subject_id: number;
  subject_name: string;
  icon: string;
  completed_topics: number;
  total_topics: number;
  progress_percent: number;
  status: CertificateStatus;
  grade: string | null;
  remaining_topics: number;
  certified_at?: string | null;
  date?: string | null;
}

export const getCertificates = async (): Promise<CertificatesResponse> => {
  const token = localStorage.getItem("token");
  const res = await api.get("/certificates", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res?.data?.data ?? {};
  const summary = data.summary ?? {};
  const certificates: ApiCertificate[] = data.certificates ?? [];

  return {
    summary: {
      certified: summary.certified ?? 0,
      pending: summary.pending ?? 0,
      topicsCompleted: summary.topics_completed ?? 0,
    },
    certificates: certificates.map((c) => ({
      subjectId: c.subject_id,
      subject: c.subject_name,
      iconFile: c.icon,
      completedTopics: c.completed_topics,
      totalTopics: c.total_topics,
      progressPercent: c.progress_percent,
      status: c.status,
      grade: c.grade,
      remainingTopics: c.remaining_topics,
      date: c.certified_at ?? c.date ?? null,
    })),
  };
};
