import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Star,
  FileText,
  Zap,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type PastStatus = "Evaluated" | "Late" | "Pending";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function homeworkStatus(hw: Homework): PastStatus {
  if (hw.evaluation_status === "COMPLETED") return "Evaluated";
  if (hw.status === "LATE") return "Late";
  return "Pending";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PastStatus }) {
  if (status === "Evaluated")
    return (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
        <CheckCircle2 size={10} /> Evaluated
      </span>
    );
  if (status === "Late")
    return (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
        <AlertCircle size={10} /> Late
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
      <Clock size={10} /> Pending
    </span>
  );
}

function HomeworkCard({
  hw,
  onOpen,
}: {
  hw: Homework;
  onOpen: () => void;
}) {
  const status = homeworkStatus(hw);
  const isLate = status === "Late";

  return (
    <button
      onClick={onOpen}
      className={cn(
        "w-full bg-white border rounded-2xl overflow-hidden shadow-sm text-left hover:shadow-md transition-shadow",
        isLate ? "border-orange-200" : "border-gray-100"
      )}
    >
      {isLate && <div className="h-1 bg-orange-400 w-full" />}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[14px] font-black text-[#101828]">{hw.title}</span>
            <StatusBadge status={status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <FileText size={10} />
              {hw.subject} · Class {hw.class}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              Due: {fmtDate(hw.due_date)}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={10} />
              {hw.total_questions} question{hw.total_questions !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[20px] font-black text-[#101828] leading-none">
            {hw.score !== null ? hw.score : "—"}
          </p>
          <p className="text-[11px] text-gray-400 font-medium">/ {hw.total_points} pts</p>
        </div>
      </div>
    </button>
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
  const opts = q.options.filter(Boolean) as NonNullable<HomeworkQuestion["options"][number]>[];
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-[#1C398E] flex items-center justify-center text-white text-[12px] font-black shrink-0">
          {index}
        </div>
        {q.subject && (
          <span className="text-[11px] font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full text-blue-600 bg-blue-50 border-blue-100">
            {q.subject}
          </span>
        )}
        <span className="ml-auto text-[12px] font-bold text-gray-500">{q.points} pts</span>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-100">
          MCQ
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="text-[14px] font-semibold text-[#101828] mb-1">{q.question}</p>
        <p className="text-[12px] text-gray-400 font-medium mb-4">Select the correct answer</p>
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
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 text-[#101828]"
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black shrink-0 transition-colors",
                    isSelected
                      ? "border-[#1C398E] bg-[#1C398E] text-white"
                      : "border-gray-300 text-gray-500"
                  )}
                >
                  {label}
                </span>
                <span className="text-[13px] font-medium">{opt.option_text}</span>
              </button>
            );
          })}
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
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-[#1C398E] flex items-center justify-center text-white text-[12px] font-black shrink-0">
          {index}
        </div>
        {q.subject && (
          <span className="text-[11px] font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full text-violet-600 bg-violet-50 border-violet-100">
            {q.subject}
          </span>
        )}
        <span className="ml-auto text-[12px] font-bold text-gray-500">{q.points} pts</span>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-violet-600 bg-violet-50 border-violet-100">
          Written
        </span>
      </div>
      <div className="px-5 py-4">
        <p className="text-[14px] font-semibold text-[#101828] mb-4">{q.question}</p>
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-gray-500">Write your answer</p>
          <textarea
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-[#101828] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none font-medium"
          />
          <p className="text-[11px] text-gray-400 text-right">{answer.length} chars</p>
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
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <div>
          <h3 className="text-[18px] font-black text-[#101828]">Submitted!</h3>
          <p className="text-[13px] text-gray-400 font-medium mt-1">{hw.title}</p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="text-center">
            <p className="text-[28px] font-black text-[#101828] leading-none">{result.mcq_score}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">MCQ score</p>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-center">
            <p className="text-[28px] font-black text-[#101828] leading-none">
              {result.final_score !== null ? result.final_score : "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Final score</p>
          </div>
          {result.xp.awarded && (
            <>
              <div className="w-px h-10 bg-gray-100" />
              <div className="text-center">
                <p className="text-[28px] font-black text-amber-500 leading-none flex items-center gap-1">
                  <Zap size={20} className="inline" />+{result.xp.xp}
                </p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">XP earned</p>
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
          className="mt-2 w-full py-3.5 rounded-2xl bg-[#1C398E] hover:bg-[#162d72] text-white text-[14px] font-black uppercase tracking-wider transition-colors"
        >
          Back to Homework
        </button>
      </div>
    </motion.div>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function HomeworkDetailView({
  hw,
  detail,
  onBack,
}: {
  hw: Homework;
  detail: HomeworkDetail;
  onBack: () => void;
}) {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const questions = detail.questions;
  const answeredCount =
    Object.keys(mcqAnswers).filter((k) => mcqAnswers[Number(k)] !== undefined).length +
    Object.values(writtenAnswers).filter((v) => v.trim().length > 0).length;
  const totalQ = questions.length;

  const handleMcqSelect = (q: HomeworkQuestion, optId: number) => {
    setMcqAnswers((prev) => {
      const next = prev[q.id] === optId
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
    return <SubmitResultScreen hw={hw} result={submitResult} onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-bold text-gray-500 hover:text-[#1C398E] transition-colors"
      >
        <ChevronLeft size={16} /> Back to homework list
      </button>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-black text-[#101828]">{hw.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  {totalQ} Question{totalQ !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <FileText size={10} /> {hw.subject} · Class {hw.class}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> Due: {fmtDate(hw.due_date)}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[20px] font-black text-[#101828] leading-none">
                {answeredCount}/{totalQ}
              </p>
              <p className="text-[11px] text-gray-400 font-medium">answered</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{ width: totalQ > 0 ? `${(answeredCount / totalQ) * 100}%` : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {questions.map((q, i) =>
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
            )
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={answeredCount < totalQ || submitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-black uppercase tracking-wider transition-all",
              answeredCount === totalQ && !submitting
                ? "bg-[#1C398E] hover:bg-[#162d72] text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <CheckCircle2 size={16} />
            {submitting
              ? "Submitting…"
              : `Submit Homework (${answeredCount}/${totalQ} answered)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeworkTab() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selected, setSelected] = useState<Homework | null>(null);
  const [detail, setDetail] = useState<HomeworkDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    getHomeworks()
      .then(setHomeworks)
      .finally(() => setLoadingList(false));
  }, []);

  const handleOpen = (hw: Homework) => {
    setSelected(hw);
    setDetail(null);
    setLoadingDetail(true);
    getHomeworkDetail(hw.id)
      .then(setDetail)
      .finally(() => setLoadingDetail(false));
  };

  const handleBack = () => {
    setSelected(null);
    setDetail(null);
  };

  const dueCount = homeworks.filter(
    (hw) => hw.evaluation_status === "NOT_STARTED"
  ).length;
  const totalEarnedPts = homeworks.reduce((sum, hw) => sum + (hw.score ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-[#101828] tracking-tight">Homework</h2>
            <p className="text-[12px] text-gray-400 font-medium">
              Assigned by your teachers · Complete on time for full marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {dueCount > 0 && (
            <span className="flex items-center gap-1.5 text-[12px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
              <AlertCircle size={12} />
              {dueCount} Pending
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

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {loadingDetail ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : detail ? (
              <HomeworkDetailView hw={selected} detail={detail} onBack={handleBack} />
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {loadingList ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : homeworks.length === 0 ? (
              <p className="text-[13px] text-gray-400 font-medium text-center py-8">
                No homework assigned yet.
              </p>
            ) : (
              <div className="space-y-3">
                {homeworks.map((hw) => (
                  <HomeworkCard key={hw.id} hw={hw} onOpen={() => handleOpen(hw)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
