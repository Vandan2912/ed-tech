import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Loader2, Eye } from "lucide-react";
import {
  getTeacherHomeworkSubmissions,
  rectifyHomeworkGrade,
  type HomeworkSubmission,
  type HomeworkSubmissionsResponse,
} from "@/api/teacherHomework";
import GradeSubmissionModal from "@/components/homework/GradeSubmissionModal";

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysLate(submittedAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(submittedAt).getTime()) / 86400000));
}

function AnswerPreview({ answer, graded }: { answer: HomeworkSubmission["answers"][number]; graded: boolean }) {
  const isCorrect = answer.type === "MCQ" && answer.student_answer === answer.correct_answer;
  return (
    <div className="grid md:grid-cols-2 gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
          Question · {answer.type === "MCQ" ? "MCQ" : "Written"}
        </p>
        <p className="text-[13px] font-bold text-[#101828] mt-1 mb-2">{answer.question}</p>
        {answer.type === "MCQ" && (
          <div
            className={`text-[11px] font-bold rounded-lg px-2.5 py-1.5 ${
              isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            <span className="text-[9px] font-black uppercase tracking-wider block">
              Correct Answer
            </span>
            {answer.correct_answer}
          </div>
        )}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
          Student's Answer
        </p>
        <p className="text-[13px] font-medium text-[#101828] mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-2 whitespace-pre-wrap">
          {answer.student_answer || "—"}
        </p>
        {graded && answer.type === "WRITTEN" && (
          <span className="inline-block mt-2 text-[11px] font-black text-[#155dfc] bg-blue-50 rounded-full px-2.5 py-1">
            Points: {answer.awarded_points ?? 0}/{answer.max_points}
          </span>
        )}
      </div>
    </div>
  );
}

function RectifyModal({
  submission,
  homeworkId,
  onClose,
  onRectified,
}: {
  submission: HomeworkSubmission | null;
  homeworkId: number;
  onClose: () => void;
  onRectified: (updated: HomeworkSubmission) => void;
}) {
  const [newScore, setNewScore] = useState(0);
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setNewScore(submission.final_score ?? 0);
      setJustification("");
    }
  }, [submission]);

  if (!submission) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const updated = await rectifyHomeworkGrade(homeworkId, submission.submission_id, {
        new_score: newScore,
        justification,
      });
      onRectified(updated);
      onClose();
    } catch {
      // no-op, error surfaced via disabled state remaining interactive
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-[#101828]/60 z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-[440px] rounded-3xl shadow-2xl border border-gray-100 p-6"
        >
          <h3 className="text-[16px] font-black text-[#101828] mb-1">
            Rectify Grade — {submission.student_name}
          </h3>
          <p className="text-[12px] text-gray-400 font-medium mb-5">
            Current score: {submission.final_score}/{submission.total_points}
          </p>
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
            New Score
          </label>
          <input
            type="number"
            min={0}
            max={submission.total_points}
            value={newScore}
            onChange={(e) => setNewScore(Number(e.target.value) || 0)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Justification
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
            placeholder="Explain why this grade is being changed..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-medium mb-5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[12px] font-black uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !justification.trim()}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-[12px] font-black uppercase tracking-wider"
            >
              {submitting ? "Saving..." : "Save Rectification"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HomeworkSubmissions() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<HomeworkSubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "graded">("pending");
  const [grading, setGrading] = useState<HomeworkSubmission | null>(null);
  const [rectifying, setRectifying] = useState<HomeworkSubmission | null>(null);

  const id = Number(homeworkId);

  const fetchSubmissions = () =>
    getTeacherHomeworkSubmissions(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const handleGraded = (updated: HomeworkSubmission) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pending: prev.pending.filter((s) => s.submission_id !== updated.submission_id),
        graded: [updated, ...prev.graded],
      };
    });
  };

  const handleRectified = (updated: HomeworkSubmission) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        graded: prev.graded.map((s) =>
          s.submission_id === updated.submission_id ? updated : s,
        ),
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 min-h-screen bg-[#f9fafb]">
        <Loader2 size={16} className="animate-spin" />
        Loading submissions...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 min-h-screen bg-[#f9fafb]">
        Couldn't load this homework's submissions.
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen">
      <GradeSubmissionModal
        homeworkId={id}
        submission={grading}
        onClose={() => setGrading(null)}
        onGraded={handleGraded}
      />
      {rectifying && (
        <RectifyModal
          submission={rectifying}
          homeworkId={id}
          onClose={() => setRectifying(null)}
          onRectified={handleRectified}
        />
      )}

      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/homework")}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-[18px] font-black text-[#101828]">{data.homework.title}</h1>
              <p className="text-[12px] text-gray-400 font-medium">
                {data.homework.class} · {data.homework.subject}
              </p>
            </div>
          </div>
          <span className="bg-violet-100 text-violet-700 text-[12px] font-black px-4 py-1.5 rounded-full shrink-0">
            {data.homework.total_submitted}/{data.homework.total_students} Submitted
          </span>
        </div>

        <div className="bg-gray-100 p-1.5 rounded-2xl flex w-fit">
          <button
            onClick={() => setTab("pending")}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
              tab === "pending" ? "bg-[#155dfc] text-white" : "text-gray-500"
            }`}
          >
            Pending Review
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                tab === "pending" ? "bg-white/20" : "bg-gray-200"
              }`}
            >
              {data.pending.length}
            </span>
          </button>
          <button
            onClick={() => setTab("graded")}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
              tab === "graded" ? "bg-[#155dfc] text-white" : "text-gray-500"
            }`}
          >
            Graded
            <span
              className={`rounded-full px-1.5 text-[10px] ${
                tab === "graded" ? "bg-white/20" : "bg-gray-200"
              }`}
            >
              {data.graded.length}
            </span>
          </button>
        </div>

        {tab === "pending" ? (
          <div className="space-y-4">
            {data.pending.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl py-12 text-center text-gray-400 text-[13px] font-medium">
                Nothing pending review.
              </div>
            ) : (
              data.pending.map((s) => {
                const late = s.is_late;
                const lateDays = daysLate(s.submitted_at);
                return (
                  <div
                    key={s.submission_id}
                    className={`bg-white rounded-3xl border p-5 space-y-4 ${
                      late ? "border-orange-200 bg-orange-50/40" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={s.profile_picture || "/user.svg"}
                          alt={s.student_name}
                          className="w-11 h-11 rounded-2xl object-cover border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-[14px] font-black text-[#101828] truncate">
                              {s.student_name}
                            </h4>
                            {late && (
                              <span className="bg-orange-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                                {lateDays} day{lateDays !== 1 ? "s" : ""} late
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium">
                            Submitted: {fmtDateTime(s.submitted_at)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setGrading(s)}
                        className="flex items-center gap-1.5 bg-[#155dfc] hover:bg-[#0f4bd6] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shrink-0"
                      >
                        <Eye size={13} />
                        Review &amp; Grade
                      </button>
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-[#101828] uppercase tracking-wider mb-2">
                        Questions &amp; Answers
                      </p>
                      <div className="space-y-2.5">
                        {s.answers.map((a) => (
                          <AnswerPreview key={a.question_id} answer={a} graded={false} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {data.graded.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl py-12 text-center text-gray-400 text-[13px] font-medium">
                No graded submissions yet.
              </div>
            ) : (
              data.graded.map((s) => (
                <div
                  key={s.submission_id}
                  className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={s.profile_picture || "/user.svg"}
                        alt={s.student_name}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-black text-[#101828] truncate">
                          {s.student_name}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium">
                          Submitted: {fmtDateTime(s.submitted_at)}
                          {s.graded_at && ` · Graded: ${fmtDateTime(s.graded_at)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                        <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">
                          Final Score
                        </p>
                        <p className="text-[16px] font-black text-emerald-700">
                          {s.final_score}
                          <span className="text-[12px] font-bold text-emerald-500">
                            /{s.total_points}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => setRectifying(s)}
                        className="flex items-center gap-1.5 border border-orange-200 text-orange-600 hover:bg-orange-50 text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition-colors"
                      >
                        <AlertTriangle size={13} />
                        Rectify
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[12px] font-black text-[#101828] uppercase tracking-wider mb-2">
                      Questions &amp; Answers
                    </p>
                    <div className="space-y-2.5">
                      {s.answers.map((a) => (
                        <AnswerPreview key={a.question_id} answer={a} graded={true} />
                      ))}
                    </div>
                  </div>

                  {s.rectifications.length > 0 && (
                    <div className="border-t border-orange-100 pt-4">
                      <p className="text-[11px] font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5 mb-2">
                        <AlertTriangle size={12} />
                        Grade Rectification History
                      </p>
                      <div className="space-y-2">
                        {s.rectifications.map((r, i) => (
                          <div
                            key={i}
                            className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[13px] font-black text-[#101828]">
                                {r.from_score}
                                {" → "}
                                <span className="text-orange-600">{r.to_score}</span>
                                <span className="text-gray-400 font-bold">
                                  /{s.total_points}
                                </span>
                              </span>
                              <span className="text-[11px] text-gray-400 font-medium">
                                {fmtDateTime(r.rectified_at)}
                              </span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-wider text-orange-500 mb-0.5">
                              Justification
                            </p>
                            <p className="text-[12px] text-orange-800">{r.justification}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
