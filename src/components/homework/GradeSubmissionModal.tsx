import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  gradeHomeworkSubmission,
  type HomeworkSubmission,
} from "@/api/teacherHomework";

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

export default function GradeSubmissionModal({
  homeworkId,
  submission,
  onClose,
  onGraded,
}: {
  homeworkId: number;
  submission: HomeworkSubmission | null;
  onClose: () => void;
  onGraded: (updated: HomeworkSubmission) => void;
}) {
  const [points, setPoints] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submission) {
      const initial: Record<number, number> = {};
      submission.answers.forEach((a) => {
        initial[a.question_id] =
          a.type === "MCQ"
            ? a.student_answer === a.correct_answer
              ? a.max_points
              : 0
            : (a.awarded_points ?? 0);
      });
      setPoints(initial);
      setError(null);
    }
  }, [submission]);

  const isOpen = submission !== null;
  const totalPoints = submission?.total_points ?? 0;
  const currentScore = Object.values(points).reduce((sum, p) => sum + p, 0);

  const handleSubmit = async () => {
    if (!submission) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await gradeHomeworkSubmission(homeworkId, submission.submission_id, {
        scores: Object.entries(points).map(([question_id, pts]) => ({
          question_id: Number(question_id),
          points: pts,
        })),
      });
      onGraded(updated);
      onClose();
    } catch {
      setError("Failed to submit grade. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && submission && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101828]/60 z-50"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[640px] rounded-3xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 p-7 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={submission.profile_picture || "/user.svg"}
                    alt={submission.student_name}
                    className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-black text-[#101828] truncate">
                      {submission.student_name}
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {submission.answers.length} Questions · Submitted{" "}
                      {fmtDateTime(submission.submitted_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 shrink-0 ml-4 focus-visible:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {submission.answers.map((a, i) => {
                  const isCorrect =
                    a.type === "MCQ" && a.student_answer === a.correct_answer;
                  return (
                    <div
                      key={a.question_id}
                      className="border border-gray-100 rounded-2xl overflow-hidden"
                    >
                      <div className="bg-[#155dfc] px-4 py-2.5 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-[12px] font-bold">
                            Question {i + 1} ·{" "}
                            {a.type === "MCQ" ? "Multiple Choice" : "Written Answer"}
                          </p>
                          <p className="text-blue-100 text-[10px] font-medium">
                            Max Points: {a.max_points}
                          </p>
                        </div>
                        <span className="bg-white/20 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0">
                          {a.type}
                        </span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                          <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                            Question
                          </p>
                          <p className="text-[13px] font-bold text-[#101828] mt-0.5">
                            {a.question}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                          <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                            Student's Answer
                          </p>
                          <p className="text-[13px] font-medium text-[#101828] mt-0.5 whitespace-pre-wrap">
                            {a.student_answer || "—"}
                          </p>
                        </div>

                        {a.type === "MCQ" ? (
                          <div
                            className={`rounded-xl px-3 py-2.5 border ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-rose-50 border-rose-200"
                            }`}
                          >
                            <p
                              className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                isCorrect ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              <CheckCircle2 size={10} />
                              Correct Answer
                            </p>
                            <p
                              className={`text-[13px] font-bold mt-0.5 ${
                                isCorrect ? "text-emerald-800" : "text-rose-800"
                              }`}
                            >
                              {a.correct_answer}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                                Award Points
                              </p>
                              <p className="text-[11px] text-gray-400 font-medium">
                                Enter points (0 - {a.max_points})
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="number"
                                min={0}
                                max={a.max_points}
                                value={points[a.question_id] ?? 0}
                                onChange={(e) =>
                                  setPoints((p) => ({
                                    ...p,
                                    [a.question_id]: Math.max(
                                      0,
                                      Math.min(a.max_points, Number(e.target.value) || 0),
                                    ),
                                  }))
                                }
                                className="w-16 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[14px] font-bold text-center text-[#101828] focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                              <span className="text-[12px] font-bold text-gray-400">
                                / {a.max_points}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {error && (
                <p className="text-[12px] font-semibold text-red-500 text-center mt-4">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Total Score
                  </p>
                  <p className="text-[15px] font-black text-[#101828]">
                    {currentScore}
                    <span className="text-gray-400 font-bold text-[13px]">
                      /{totalPoints}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#155dfc] hover:bg-[#0f4bd6] disabled:opacity-60 text-white text-[12px] font-black uppercase tracking-wider px-6 py-3 rounded-2xl transition-colors focus-visible:outline-none"
                >
                  <ShieldCheck size={15} />
                  {submitting ? "Submitting..." : "Submit Final Grade & Lock"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
