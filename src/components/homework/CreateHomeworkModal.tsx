import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Target,
  FileText,
  CheckCircle2,
  Calendar,
  Trash2,
  Plus,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { getClasses, type ClassOption } from "@/api/user";
import {
  createTeacherHomework,
  type CreateHomeworkQuestion,
  type QuestionType,
  type TeacherHomework,
} from "@/api/teacherHomework";

const SUBJECT_OPTIONS = [
  { label: "Mathematics", value: "Mathematics" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Biology", value: "Biology" },
  { label: "History", value: "History" },
  { label: "Geography", value: "Geography" },
  { label: "Literature", value: "Literature" },
];

const STEPS = [
  { id: 1, label: "Setup", icon: Target },
  { id: 2, label: "Questions", icon: FileText },
  { id: 3, label: "Review", icon: CheckCircle2 },
] as const;

type DraftQuestion = CreateHomeworkQuestion & { key: string };

function emptyDraft(type: QuestionType): DraftQuestion {
  return {
    key: crypto.randomUUID(),
    type,
    question: "",
    points: 10,
    options: type === "MCQ" ? ["", "", "", ""] : undefined,
    correct_option_indexes: type === "MCQ" ? [] : undefined,
  };
}

export default function CreateHomeworkModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (homework: TeacherHomework) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  const [title, setTitle] = useState("");
  const [standard, setStandard] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [draft, setDraft] = useState<DraftQuestion>(emptyDraft("MCQ"));

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getClasses()
        .then(setClasses)
        .catch((err) => console.error("Failed to load classes", err));
    }
  }, [isOpen]);

  const classOptions = classes.map((c) => ({ label: c.name, value: c.name }));

  const resetAll = () => {
    setStep(1);
    setTitle("");
    setStandard("");
    setSubject("");
    setDueDate("");
    setQuestions([]);
    setDraft(emptyDraft("MCQ"));
    setError(null);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const canGoToQuestions =
    title.trim() !== "" && standard !== "" && subject !== "" && dueDate !== "";

  const canAddQuestion =
    draft.question.trim() !== "" &&
    (draft.type === "WRITTEN" ||
      ((draft.options ?? []).filter((o) => o.trim() !== "").length >= 2 &&
        (draft.correct_option_indexes ?? []).length >= 1));

  const handleAddQuestion = () => {
    if (!canAddQuestion) return;
    setQuestions((prev) => [...prev, draft]);
    setDraft(emptyDraft(draft.type));
  };

  const handleRemoveQuestion = (key: string) => {
    setQuestions((prev) => prev.filter((q) => q.key !== key));
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const homework = await createTeacherHomework({
        title: title.trim(),
        standard,
        subject,
        due_date: dueDate,
        questions: questions.map(
          (q): CreateHomeworkQuestion => ({
            type: q.type,
            question: q.question,
            points: q.points,
            options: q.options,
            correct_option_indexes: q.correct_option_indexes,
          }),
        ),
      });
      onCreated?.(homework);
      handleClose();
    } catch {
      setError("Failed to publish homework. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101828]/60 z-50"
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[640px] rounded-3xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 p-7 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-[20px] font-black text-[#101828] tracking-tight leading-tight">
                    Create Homework Assignment
                  </h2>
                  <p className="text-[13px] text-gray-400 font-medium mt-0.5">
                    Build custom homework for your class
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 shrink-0 ml-4 focus-visible:outline-none focus:ring-2 focus:ring-blue-300">
                  <X size={16} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center mb-6">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = step > s.id;
                  const isActive = step === s.id;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center flex-1 last:flex-none">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isActive
                              ? "bg-[#F54900] text-white"
                              : isDone
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-100 text-gray-400"
                          }`}>
                          <Icon size={14} />
                        </div>
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider whitespace-nowrap ${
                            isActive
                              ? "text-[#F54900]"
                              : isDone
                                ? "text-emerald-600"
                                : "text-gray-400"
                          }`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-3 rounded-full ${
                            isDone ? "bg-emerald-400" : "bg-gray-100"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Setup */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-orange-700">
                      Step 1: Assignment Details
                    </p>
                    <p className="text-[12px] text-orange-600 font-medium mt-0.5">
                      Set up basic information for this homework assignment
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Homework Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Chemical Reactions Worksheet"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[14px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Standard <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={standard}
                        onChange={setStandard}
                        options={classOptions}
                        placeholder="Select Standard"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        value={subject}
                        onChange={setSubject}
                        options={SUBJECT_OPTIONS}
                        placeholder="Select Subject"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[14px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium mt-1.5">
                      Submissions after this time will be marked as late
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!canGoToQuestions}
                    onClick={() => setStep(2)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#155dfc] hover:bg-[#0f4bd6] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none">
                    Next: Add Questions
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Questions */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-violet-700">
                      Step 2: Create Questions
                    </p>
                    <p className="text-[12px] text-violet-600 font-medium mt-0.5">
                      Add MCQ or written answer questions for students to
                      complete
                    </p>
                  </div>

                  {questions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[13px] font-black text-[#101828]">
                        Added Questions ({questions.length})
                      </p>
                      {questions.map((q, i) => (
                        <div
                          key={q.key}
                          className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                          <span className="text-[12px] font-bold text-gray-500 shrink-0">
                            Q{i + 1}.
                          </span>
                          <span className="flex-1 text-[13px] font-bold text-[#101828] truncate">
                            {q.question}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                              q.type === "MCQ"
                                ? "text-blue-600 bg-blue-50"
                                : "text-emerald-600 bg-emerald-50"
                            }`}>
                            {q.type}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">
                            {q.points}pts
                          </span>
                          <button
                            onClick={() => handleRemoveQuestion(q.key)}
                            className="text-red-400 hover:text-red-600 transition-colors shrink-0 focus-visible:outline-none">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                    <p className="text-[13px] font-black text-[#101828]">
                      New Question
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({
                            ...emptyDraft("MCQ"),
                            question: d.question,
                          }))
                        }
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
                          draft.type === "MCQ"
                            ? "bg-[#155dfc] text-white"
                            : "bg-white border border-gray-200 text-gray-600"
                        }`}>
                        Multiple Choice (MCQ)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({
                            ...emptyDraft("WRITTEN"),
                            question: d.question,
                          }))
                        }
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
                          draft.type === "WRITTEN"
                            ? "bg-[#155dfc] text-white"
                            : "bg-white border border-gray-200 text-gray-600"
                        }`}>
                        Written Answer
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={draft.question}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, question: e.target.value }))
                        }
                        placeholder="Type your question here..."
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>

                    {draft.type === "MCQ" && (
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                          Answer Options (click ✓ to mark correct)
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {(draft.options ?? []).map((opt, i) => {
                            const isCorrect = (
                              draft.correct_option_indexes ?? []
                            ).includes(i);
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-colors ${
                                  isCorrect
                                    ? "border-emerald-300 bg-emerald-50"
                                    : "border-gray-200 bg-white"
                                }`}>
                                <input
                                  value={opt}
                                  onChange={(e) =>
                                    setDraft((d) => ({
                                      ...d,
                                      options: (d.options ?? []).map((o, oi) =>
                                        oi === i ? e.target.value : o,
                                      ),
                                    }))
                                  }
                                  placeholder={`Option ${i + 1}`}
                                  className="flex-1 min-w-0 text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraft((d) => {
                                      const current = d.correct_option_indexes ?? [];
                                      const next = current.includes(i)
                                        ? current.filter((ci) => ci !== i)
                                        : [...current, i];
                                      return { ...d, correct_option_indexes: next };
                                    })
                                  }
                                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                    isCorrect
                                      ? "bg-emerald-500 text-white"
                                      : "bg-gray-200 text-transparent"
                                  }`}>
                                  <Check size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-2">
                          You can mark more than one option as correct.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                        Points
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={draft.points}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            points: Number(e.target.value) || 0,
                          }))
                        }
                        className="w-24 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!canAddQuestion}
                      onClick={handleAddQuestion}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#155dfc] hover:bg-[#0f4bd6] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-wider transition-colors focus-visible:outline-none">
                      <Plus size={14} />
                      Add Question
                    </button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none">
                      <ChevronLeft size={16} />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={questions.length === 0}
                      onClick={() => setStep(3)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#155dfc] hover:bg-[#0f4bd6] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none">
                      Review &amp; Publish
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                        Step 3: Review &amp; Publish
                      </p>
                      <p className="text-[12px] text-emerald-600 font-medium mt-0.5">
                        Review your homework before publishing to the class
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 border border-gray-100 rounded-2xl p-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Title
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {title}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Class
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {standard}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Subject
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Deadline
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {dueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Questions
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {questions.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Total Points
                      </p>
                      <p className="text-[15px] font-bold text-[#101828] mt-0.5">
                        {totalPoints}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {questions.map((q, i) => (
                      <div
                        key={q.key}
                        className="border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#101828] truncate">
                            Q{i + 1}. {q.question}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              q.type === "MCQ"
                                ? "text-blue-600 bg-blue-50"
                                : "text-emerald-600 bg-emerald-50"
                            }`}>
                            {q.type === "MCQ" ? "MCQ" : "Written Answer"}
                          </span>
                        </div>
                        <span className="text-[12px] font-bold text-gray-400 shrink-0">
                          {q.points}pts
                        </span>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <p className="text-[12px] font-semibold text-red-500 text-center">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none">
                      <ChevronLeft size={16} />
                      Edit Questions
                    </button>
                    <button
                      type="button"
                      disabled={publishing}
                      onClick={handlePublish}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#155dfc] hover:bg-[#0f4bd6] disabled:opacity-60 text-white text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none">
                      <CheckCircle2 size={16} />
                      {publishing
                        ? "Publishing..."
                        : "Publish Homework to Class"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
