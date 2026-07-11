import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  FileText,
  Zap,
  Mic,
  Paperclip,
  Link2,
  ChevronRight,
  Send,
  Hourglass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getHomeworks,
  getHomeworkDetail,
  saveAnswer,
  submitHomework,
  type Homework,
  type HomeworkQuestion,
  type HomeworkDetail,
  type SubmitResult,
} from "@/api/homework";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} · ${time}`;
}

type PastStatus = "Evaluated" | "Late" | "Waiting" | "Pending";

function pastStatusOf(hw: Homework): PastStatus {
  if (hw.evaluation_status === "COMPLETED") return "Evaluated";
  if (hw.evaluation_status === "PENDING") return "Waiting";
  if (hw.status === "LATE") return "Late";
  return "Pending";
}

// Subject -> color palette for chips
function subjectPalette(subject: string | null | undefined) {
  const s = (subject ?? "").toLowerCase();
  if (s.includes("math"))
    return {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    };
  if (s.includes("phys"))
    return {
      text: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    };
  if (s.includes("chem"))
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    };
  if (s.includes("bio"))
    return {
      text: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100",
    };
  if (s.includes("eng") || s.includes("lit"))
    return {
      text: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    };
  if (s.includes("hist") || s.includes("social"))
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    };
  return {
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-100",
  };
}

// ─── Past-homework status chip ────────────────────────────────────────────────

function PastStatusChip({ status }: { status: PastStatus }) {
  if (status === "Evaluated")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
        <CheckCircle2 size={10} /> Evaluated
      </span>
    );
  if (status === "Late")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
        <AlertCircle size={10} /> Late
      </span>
    );
  if (status === "Waiting")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
        <Hourglass size={10} /> Waiting for Evaluation
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
      <Clock size={10} /> Pending
    </span>
  );
}

// ─── Question cards ───────────────────────────────────────────────────────────

function QuestionAttachmentBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1C398E] hover:bg-blue-50 rounded-lg transition-colors">
        <Mic size={12} /> Voice Note
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1C398E] hover:bg-blue-50 rounded-lg transition-colors">
        <Paperclip size={12} /> Attach File
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1C398E] hover:bg-blue-50 rounded-lg transition-colors">
        <Link2 size={12} /> Add Link
      </button>
    </div>
  );
}

function QuestionHeader({ q, index }: { q: HomeworkQuestion; index: number }) {
  const palette = subjectPalette(q.subject);
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
      <div className="w-7 h-7 rounded-full bg-[#1C398E] flex items-center justify-center text-white text-[12px] font-black shrink-0">
        {index}
      </div>
      {q.subject && (
        <span
          className={cn(
            "text-[11px] font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full",
            palette.text,
            palette.bg,
            palette.border,
          )}>
          {q.subject}
        </span>
      )}
      <span className="ml-auto text-[12px] font-bold text-gray-500">
        {q.points} pts
      </span>
      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
          q.type === "MCQ"
            ? "text-blue-600 bg-blue-50 border-blue-100"
            : "text-violet-600 bg-violet-50 border-violet-100",
        )}>
        {q.type === "MCQ" ? "MCQ" : "Written"}
      </span>
    </div>
  );
}

function MCQCard({
  q,
  index,
  selected,
  onSelect,
}: {
  q: HomeworkQuestion;
  index: number;
  selected: number | null;
  onSelect: (optId: number) => void;
}) {
  const opts = q.options.filter(Boolean) as NonNullable<
    HomeworkQuestion["options"][number]
  >[];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <QuestionHeader q={q} index={index} />
      <div className="px-5 py-4">
        <p className="text-[14px] font-semibold text-[#101828] mb-1">
          {q.question}
        </p>
        <p className="text-[12px] text-gray-400 font-medium mb-4">
          Select the correct answer
        </p>
        <div className="space-y-2.5">
          {opts.map((opt, i) => {
            const label = String.fromCharCode(65 + i);
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-[#1C398E] bg-blue-50 text-[#1C398E]"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 text-[#101828]",
                )}>
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black shrink-0 transition-colors",
                    isSelected
                      ? "border-[#1C398E] bg-[#1C398E] text-white"
                      : "border-gray-300 text-gray-500",
                  )}>
                  {label}
                </span>
                <span className="text-[13px] font-medium">
                  {opt.option_text}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <QuestionAttachmentBar />
        </div>
      </div>
    </div>
  );
}

function WrittenCard({
  q,
  index,
  answer,
  onAnswer,
}: {
  q: HomeworkQuestion;
  index: number;
  answer: string;
  onAnswer: (val: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <QuestionHeader q={q} index={index} />
      <div className="px-5 py-4">
        <p className="text-[14px] font-semibold text-[#101828] mb-4">
          {q.question}
        </p>
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-gray-500">
            Write your answer
          </p>
          <textarea
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-[#101828] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none font-medium"
          />
          <p className="text-[11px] text-gray-400 text-right">
            {answer.length} chars
          </p>
        </div>
        <div className="mt-2">
          <QuestionAttachmentBar />
        </div>
      </div>
    </div>
  );
}

// ─── XP Result Screen ─────────────────────────────────────────────────────────

function SubmitResultScreen({
  hw,
  result,
  onBack,
}: {
  hw: Homework;
  result: SubmitResult;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-[18px] font-black text-[#101828]">Submitted!</h3>
          <p className="text-[13px] text-gray-400 font-medium mt-1">
            {hw.title}
          </p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="text-center">
            <p className="text-[28px] font-black text-[#101828] leading-none">
              {result.mcq_score}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              MCQ score
            </p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-[28px] font-black text-[#101828] leading-none">
              {result.final_score !== null ? result.final_score : "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Final score
            </p>
          </div>
          {result.xp.awarded && (
            <>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <p className="text-[28px] font-black text-amber-500 leading-none flex items-center gap-1">
                  <Zap size={20} className="inline" />+{result.xp.xp}
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  XP earned
                </p>
              </div>
            </>
          )}
        </div>

        <div className="w-full bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[12px] font-semibold text-amber-700 text-center">
          {result.evaluation_status === "PENDING_EVALUATION"
            ? "Written answers are pending teacher evaluation."
            : result.evaluation_status}
        </div>

        <button
          onClick={onBack}
          className="mt-2 w-full py-3.5 rounded-2xl bg-[#1C398E] hover:bg-[#162d72] text-white text-[14px] font-black uppercase tracking-wider transition-colors">
          Back to Homework
        </button>
      </div>
    </motion.div>
  );
}

// ─── Active Homework (expanded inline) ────────────────────────────────────────

function ActiveHomeworkCard({
  hw,
  detail,
  loading,
  onSubmitted,
}: {
  hw: Homework;
  detail: HomeworkDetail | null;
  loading: boolean;
  onSubmitted: () => void;
}) {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );

  const questions = detail?.questions ?? [];
  const totalQ = questions.length;
  const answeredCount =
    Object.keys(mcqAnswers).filter((k) => mcqAnswers[Number(k)] !== undefined)
      .length +
    Object.values(writtenAnswers).filter((v) => v.trim().length > 0).length;

  const handleMcqSelect = (q: HomeworkQuestion, optId: number) => {
    setMcqAnswers((prev) => {
      const next =
        prev[q.id] === optId
          ? { ...prev, [q.id]: undefined as unknown as number }
          : { ...prev, [q.id]: optId };
      if (next[q.id] !== undefined) {
        saveAnswer(hw.id, {
          question_id: q.id,
          answer: { type: "MCQ", selected_option_id: optId },
        });
      }
      return next;
    });
  };

  const handleWrittenChange = (q: HomeworkQuestion, val: string) => {
    setWrittenAnswers((prev) => ({ ...prev, [q.id]: val }));
    clearTimeout(debounceTimers.current[q.id]);
    debounceTimers.current[q.id] = setTimeout(() => {
      if (val.trim().length > 0) {
        saveAnswer(hw.id, {
          question_id: q.id,
          answer: { type: "WRITTEN", text: val },
        });
      }
    }, 800);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitHomework(hw.id);
      setSubmitResult(result);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitResult) {
    return (
      <SubmitResultScreen hw={hw} result={submitResult} onBack={onSubmitted} />
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Top gradient stripe — matches Figma's accent bar */}
      <div className="h-1.5 bg-linear-to-r from-rose-400 via-fuchsia-500 to-blue-500" />

      {/* Header */}
      <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <FileText size={16} className="text-[#1C398E]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-[14px] sm:text-[15px] font-black text-[#101828] truncate">
                  {hw.title}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full shrink-0">
                  {hw.total_questions} Q{hw.total_questions !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={10} /> {fmtDate(hw.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> Due: {fmtDateTime(hw.due_date)}
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={10} /> {hw.subject} · Class {hw.class}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[18px] sm:text-[20px] font-black text-[#101828] leading-none">
              {answeredCount}/{totalQ}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">answered</p>
          </div>
        </div>

        <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{
              width: totalQ > 0 ? `${(answeredCount / totalQ) * 100}%` : "0%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Question list */}
      <div className="p-4 sm:p-6 space-y-4 bg-gray-50/50">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          questions.map((q, i) =>
            q.type === "MCQ" ? (
              <MCQCard
                key={q.id}
                q={q}
                index={i + 1}
                selected={mcqAnswers[q.id] ?? null}
                onSelect={(optId) => handleMcqSelect(q, optId)}
              />
            ) : (
              <WrittenCard
                key={q.id}
                q={q}
                index={i + 1}
                answer={writtenAnswers[q.id] ?? ""}
                onAnswer={(val) => handleWrittenChange(q, val)}
              />
            ),
          )
        )}
      </div>

      {/* Submit */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
        <button
          onClick={handleSubmit}
          disabled={answeredCount < totalQ || submitting || totalQ === 0}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-black uppercase tracking-wider transition-all",
            answeredCount === totalQ && totalQ > 0 && !submitting
              ? "bg-linear-to-r from-[#1C398E] via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}>
          <Send size={16} />
          {submitting
            ? "Submitting…"
            : `Submit All Questions (${answeredCount}/${totalQ} answered)`}
        </button>
      </div>
    </div>
  );
}

// ─── Past homework row ────────────────────────────────────────────────────────

function PastHomeworkRow({ hw }: { hw: Homework }) {
  const status = pastStatusOf(hw);
  const isLate = hw.status === "LATE";
  return (
    <button
      type="button"
      className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[14px] font-black text-[#101828]">
              {hw.title}
            </span>
            {isLate && status !== "Late" && <PastStatusChip status="Late" />}
            <PastStatusChip status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={10} /> Given: {fmtDate(hw.created_at)}
            </span>
            {hw.evaluated_at && (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={10} /> Submitted: {fmtDate(hw.evaluated_at)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={10} /> {status === "Late" ? "Due was" : "Due"}:{" "}
              {fmtDate(hw.due_date)}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[18px] font-black text-[#101828] leading-none">
            {hw.score !== null ? hw.score : "—"}
          </p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            / {hw.total_points} pts
          </p>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeworkTab() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [detail, setDetail] = useState<HomeworkDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getHomeworks()
      .then(setHomeworks)
      .finally(() => setLoadingList(false));
  }, []);

  // Partition into active (next due, not yet submitted) and past (everything else)
  const { active, past } = useMemo(() => {
    const open = homeworks.filter(
      (hw) =>
        hw.evaluation_status === "NOT_STARTED" ||
        hw.evaluation_status === "IN_PROGRESS",
    );
    open.sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );
    const active = open[0] ?? null;
    const past = homeworks
      .filter((hw) => hw.id !== active?.id)
      .sort(
        (a, b) =>
          new Date(b.due_date).getTime() - new Date(a.due_date).getTime(),
      );
    return { active, past };
  }, [homeworks]);

  // Auto-fetch the active homework's questions
  useEffect(() => {
    if (!active) {
      setDetail(null);
      return;
    }
    setDetail(null);
    setLoadingDetail(true);
    getHomeworkDetail(active.id)
      .then(setDetail)
      .finally(() => setLoadingDetail(false));
  }, [active?.id]);

  const handleSubmitted = () => {
    // Refresh list after a submission
    setLoadingList(true);
    getHomeworks()
      .then(setHomeworks)
      .finally(() => setLoadingList(false));
  };

  const dueCount = homeworks.filter(
    (hw) =>
      hw.evaluation_status === "NOT_STARTED" ||
      hw.evaluation_status === "IN_PROGRESS",
  ).length;
  const totalEarnedPts = homeworks.reduce(
    (sum, hw) => sum + (hw.score ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* ── Section header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-[#101828] tracking-tight">
              Daily Homework
            </h2>
            <p className="text-[12px] text-gray-400 font-medium">
              Assigned by your teachers · Complete on time for full marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {dueCount > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
              <AlertCircle size={12} />
              {dueCount} Due
            </span>
          )}
          {totalEarnedPts > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <Star size={12} />
              {totalEarnedPts} pts earned
            </span>
          )}
        </div>
      </div>

      {/* ── Active homework ── */}
      <AnimatePresence mode="wait">
        {loadingList ? (
          <motion.div key="loading" className="space-y-3">
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          </motion.div>
        ) : active ? (
          <motion.div
            key={`active-${active.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}>
            <ActiveHomeworkCard
              hw={active}
              detail={detail}
              loading={loadingDetail}
              onSubmitted={handleSubmitted}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <p className="text-[14px] font-black text-[#101828]">
              You're all caught up!
            </p>
            <p className="text-[12px] text-gray-400 font-medium mt-1">
              No homework due right now.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Past homework ── */}
      {past.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-black text-[#101828]">
                Past Homework
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                {past.length}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {past.map((hw) => (
              <PastHomeworkRow key={hw.id} hw={hw} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
