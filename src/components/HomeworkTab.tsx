import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  Mic,
  Paperclip,
  Link2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = "MCQ" | "Written";

interface MCQQuestion {
  id: number;
  type: "MCQ";
  subject: string;
  pts: number;
  question: string;
  options: { label: string; text: string }[];
}

interface WrittenQuestion {
  id: number;
  type: "Written";
  subject: string;
  pts: number;
  question: string;
}

type Question = MCQQuestion | WrittenQuestion;

type PastStatus = "Evaluated" | "Late" | "Waiting";

interface SubmittedAnswer {
  qNum: number;
  subject: string;
  type: QuestionType;
  question: string;
  answer: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

interface PastAssignment {
  id: number;
  title: string;
  status: PastStatus;
  given: string;
  submitted: string;
  due: string;
  earnedPts: number | null;
  totalPts: number;
  feedback?: string;
  submittedAnswers?: SubmittedAnswer[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "text-blue-600 bg-blue-50 border-blue-100",
  Physics: "text-violet-600 bg-violet-50 border-violet-100",
  Chemistry: "text-emerald-600 bg-emerald-50 border-emerald-100",
  Biology: "text-pink-600 bg-pink-50 border-pink-100",
  History: "text-orange-600 bg-orange-50 border-orange-100",
  Geography: "text-teal-600 bg-teal-50 border-teal-100",
  English: "text-purple-600 bg-purple-50 border-purple-100",
  "Computer Science": "text-cyan-600 bg-cyan-50 border-cyan-100",
  Economics: "text-amber-600 bg-amber-50 border-amber-100",
  Art: "text-rose-600 bg-rose-50 border-rose-100",
};

const QUESTIONS: Question[] = [
  {
    id: 1, type: "MCQ", subject: "Mathematics", pts: 10,
    question: "Solve the quadratic equation: x² + 5x + 6 = 0. Select the correct roots.",
    options: [
      { label: "A", text: "x = −2, −3" },
      { label: "B", text: "x = 2, 3" },
      { label: "C", text: "x = −1, −6" },
      { label: "D", text: "x = 1, 6" },
    ],
  },
  {
    id: 2, type: "Written", subject: "Physics", pts: 10,
    question: "Explain Newton's Third Law of Motion with a real-world example from daily life.",
  },
  {
    id: 3, type: "MCQ", subject: "Chemistry", pts: 10,
    question: "Which element has atomic number 6 and is the foundation of organic chemistry?",
    options: [
      { label: "A", text: "Nitrogen" },
      { label: "B", text: "Carbon" },
      { label: "C", text: "Oxygen" },
      { label: "D", text: "Hydrogen" },
    ],
  },
  {
    id: 4, type: "Written", subject: "Biology", pts: 10,
    question: "Describe the process of photosynthesis and name its two main stages.",
  },
  {
    id: 5, type: "MCQ", subject: "History", pts: 10,
    question: "In which year did World War II officially end?",
    options: [
      { label: "A", text: "1943" },
      { label: "B", text: "1944" },
      { label: "C", text: "1945" },
      { label: "D", text: "1946" },
    ],
  },
  {
    id: 6, type: "Written", subject: "Geography", pts: 10,
    question: "Describe the water cycle in detail, including evaporation, condensation, and precipitation.",
  },
  {
    id: 7, type: "MCQ", subject: "English", pts: 10,
    question: "Identify the literary device used in: 'The stars danced playfully in the sky.'",
    options: [
      { label: "A", text: "Simile" },
      { label: "B", text: "Metaphor" },
      { label: "C", text: "Personification" },
      { label: "D", text: "Alliteration" },
    ],
  },
  {
    id: 8, type: "Written", subject: "Computer Science", pts: 10,
    question: "What is recursion in programming? Explain with a simple example.",
  },
  {
    id: 9, type: "MCQ", subject: "Economics", pts: 10,
    question: "According to the Law of Demand, what happens to quantity demanded when price increases?",
    options: [
      { label: "A", text: "Increases" },
      { label: "B", text: "Decreases" },
      { label: "C", text: "Stays the same" },
      { label: "D", text: "Doubles" },
    ],
  },
  {
    id: 10, type: "Written", subject: "Art", pts: 10,
    question: "Describe two key characteristics of the Impressionist movement in art.",
  },
];

const PAST_ASSIGNMENTS: PastAssignment[] = [
  {
    id: 1,
    title: "Algebra & Forces — Weekly Review",
    status: "Evaluated",
    given: "Mar 20, 2026",
    submitted: "Mar 22, 2026",
    due: "Mar 22, 2026",
    earnedPts: 85,
    totalPts: 100,
    feedback:
      "Excellent work on the algebra section! Your explanation of Newton's Third Law was clear and well-structured. Minor deductions for the graph sketch — labels were missing. Keep it up!",
    submittedAnswers: [
      {
        qNum: 1, subject: "Mathematics", type: "MCQ",
        question: "Solve: 2x² − 7x + 3 = 0",
        answer: "x = 3, x = 0.5",
      },
      {
        qNum: 2, subject: "Physics", type: "Written",
        question: "Explain centripetal force with a real-world example.",
        answer:
          "Centripetal force is the net force directed toward the centre of a circular path. For example, when a car turns a corner, friction acts as the centripetal force keeping the car on the curved road.",
        isVoiceNote: true,
        voiceDuration: "00:47",
      },
    ],
  },
  {
    id: 2,
    title: "Cell Biology & Chemical Reactions",
    status: "Late",
    given: "Mar 15, 2026",
    submitted: "Mar 19, 2026",
    due: "Mar 18, 2026",
    earnedPts: 58,
    totalPts: 80,
  },
  {
    id: 3,
    title: "English Literature — Poetry Analysis",
    status: "Waiting",
    given: "Mar 25, 2026",
    submitted: "Mar 27, 2026",
    due: "Mar 28, 2026",
    earnedPts: null,
    totalPts: 60,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubjectTag({ subject }: { subject: string }) {
  const colorClass = SUBJECT_COLORS[subject] ?? "text-gray-600 bg-gray-50 border-gray-200";
  return (
    <span className={cn("text-[11px] font-black uppercase tracking-wider border px-2.5 py-0.5 rounded-full", colorClass)}>
      {subject}
    </span>
  );
}

function QuestionTypeBadge({ type }: { type: QuestionType }) {
  return (
    <span
      className={cn(
        "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border",
        type === "MCQ"
          ? "text-blue-600 bg-blue-50 border-blue-100"
          : "text-violet-600 bg-violet-50 border-violet-100"
      )}
    >
      {type}
    </span>
  );
}

function AttachmentButtons() {
  return (
    <div className="flex items-center gap-2 pt-2">
      <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
        <Mic size={12} /> Voice Note
      </button>
      <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
        <Paperclip size={12} /> Attach File
      </button>
      <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
        <Link2 size={12} /> Add Link
      </button>
    </div>
  );
}

function MCQQuestionCard({
  q,
  selected,
  onSelect,
}: {
  q: MCQQuestion;
  selected: string | null;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-[#1C398E] flex items-center justify-center text-white text-[12px] font-black shrink-0">
          {q.id}
        </div>
        <SubjectTag subject={q.subject} />
        <span className="ml-auto text-[12px] font-bold text-gray-500">{q.pts} pts</span>
        <QuestionTypeBadge type="MCQ" />
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-[14px] font-semibold text-[#101828] mb-1">{q.question}</p>
        <p className="text-[12px] text-gray-400 font-medium mb-4">Select the correct answer</p>

        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = selected === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => onSelect(opt.label)}
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
                  {opt.label}
                </span>
                <span className="text-[13px] font-medium">{opt.text}</span>
              </button>
            );
          })}
        </div>

        <AttachmentButtons />
      </div>
    </div>
  );
}

function WrittenQuestionCard({
  q,
  answer,
  onAnswer,
}: {
  q: WrittenQuestion;
  answer: string;
  onAnswer: (val: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        <div className="w-7 h-7 rounded-full bg-[#1C398E] flex items-center justify-center text-white text-[12px] font-black shrink-0">
          {q.id}
        </div>
        <SubjectTag subject={q.subject} />
        <span className="ml-auto text-[12px] font-bold text-gray-500">{q.pts} pts</span>
        <QuestionTypeBadge type="Written" />
      </div>

      {/* Body */}
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

        <AttachmentButtons />
      </div>
    </div>
  );
}

function PastStatusBadge({ status }: { status: PastStatus }) {
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
      <Clock size={10} /> Waiting for Evaluation
    </span>
  );
}

function PastAssignmentCard({ assignment }: { assignment: PastAssignment }) {
  const [expanded, setExpanded] = useState(false);
  const isLate = assignment.status === "Late";

  return (
    <div className={cn("bg-white border rounded-2xl overflow-hidden shadow-sm", isLate ? "border-orange-200" : "border-gray-100")}>
      {isLate && <div className="h-1 bg-orange-400 w-full" />}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[14px] font-black text-[#101828]">{assignment.title}</span>
            <PastStatusBadge status={assignment.status} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              <span className="font-semibold text-gray-500">Given:</span> {assignment.given}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span className="font-semibold text-gray-500">Submitted:</span> {assignment.submitted}
            </span>
            {isLate ? (
              <span className="flex items-center gap-1 text-orange-500">
                <Clock size={10} />
                <span className="font-semibold">Due was:</span> {assignment.due}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                <span className="font-semibold text-gray-500">Due:</span> {assignment.due}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[20px] font-black text-[#101828] leading-none">
              {assignment.earnedPts !== null ? assignment.earnedPts : "—"}
            </p>
            <p className="text-[11px] text-gray-400 font-medium">/ {assignment.totalPts} pts</p>
          </div>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
              {assignment.feedback && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MessageSquare size={13} className="text-emerald-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                      Teacher Feedback
                    </span>
                  </div>
                  <p className="text-[13px] text-emerald-900 font-medium leading-relaxed">
                    {assignment.feedback}
                  </p>
                </div>
              )}

              {assignment.submittedAnswers && assignment.submittedAnswers!.length > 0 && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-3">
                    Your Submitted Answers
                  </p>
                  <div className="space-y-3">
                    {assignment.submittedAnswers.map((ans) => (
                      <div key={ans.qNum} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-[11px] font-black text-gray-500">Q{ans.qNum}</span>
                          <SubjectTag subject={ans.subject} />
                          <QuestionTypeBadge type={ans.type} />
                        </div>
                        <p className="text-[12px] text-gray-500 font-medium mb-1.5">{ans.question}</p>
                        {ans.isVoiceNote ? (
                          <div className="flex items-center gap-2 text-[12px] font-bold text-violet-600">
                            <Mic size={13} />
                            <span>Voice note · {ans.voiceDuration}</span>
                          </div>
                        ) : (
                          <p className="text-[13px] text-[#101828] font-medium leading-relaxed">{ans.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeworkTab() {
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>({});

  const answeredCount =
    Object.keys(mcqAnswers).length +
    Object.values(writtenAnswers).filter((v) => v.trim().length > 0).length;

  const totalQuestions = QUESTIONS.length;

  const handleMcqSelect = (id: number, label: string) => {
    setMcqAnswers((prev) =>
      prev[id] === label ? { ...prev, [id]: "" } : { ...prev, [id]: label }
    );
  };

  const handleWrittenChange = (id: number, val: string) => {
    setWrittenAnswers((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-8">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-[#101828] tracking-tight">Daily Homework</h2>
            <p className="text-[12px] text-gray-400 font-medium">
              Assigned by your teachers · Complete on time for full marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
            <AlertCircle size={12} />
            1 Due
          </span>
          <span className="flex items-center gap-1.5 text-[12px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Star size={12} />
            143 pts earned
          </span>
        </div>
      </div>

      {/* ── Assignment card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Assignment header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-black text-[#101828]">Daily Mixed Subject Assignment</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                  {totalQuestions} Questions
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={10} /> Given: Mar 31, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> Due: Mar 31, 2026 · 11:59 PM
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[20px] font-black text-[#101828] leading-none">{answeredCount}/{totalQuestions}</p>
              <p className="text-[11px] text-gray-400 font-medium">answered</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="p-6 space-y-4">
          {QUESTIONS.map((q) =>
            q.type === "MCQ" ? (
              <MCQQuestionCard
                key={q.id}
                q={q}
                selected={mcqAnswers[q.id] ?? null}
                onSelect={(label) => handleMcqSelect(q.id, label)}
              />
            ) : (
              <WrittenQuestionCard
                key={q.id}
                q={q}
                answer={writtenAnswers[q.id] ?? ""}
                onAnswer={(val) => handleWrittenChange(q.id, val)}
              />
            )
          )}
        </div>

        {/* Submit */}
        <div className="px-6 pb-6">
          <button
            className={cn(
              "w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[14px] font-black uppercase tracking-wider transition-all",
              answeredCount === totalQuestions
                ? "bg-[#1C398E] hover:bg-[#162d72] text-white shadow-lg shadow-blue-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
            disabled={answeredCount < totalQuestions}
          >
            <CheckCircle2 size={16} />
            Submit All Homework ({answeredCount}/{totalQuestions} answered)
          </button>
        </div>
      </div>

      {/* ── Past Homework ── */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-[16px] font-black text-[#101828] tracking-tight">Past Homework</h2>
            <p className="text-[12px] text-gray-400 font-medium">3 assignments · 1 awaiting evaluation</p>
          </div>
          <div className="flex items-center gap-1.5 text-[14px] font-black text-[#101828]">
            <Star size={16} className="text-amber-500" />
            143
            <span className="text-[12px] font-bold text-gray-400">total pts</span>
          </div>
        </div>

        <div className="space-y-3">
          {PAST_ASSIGNMENTS.map((a) => (
            <PastAssignmentCard key={a.id} assignment={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
