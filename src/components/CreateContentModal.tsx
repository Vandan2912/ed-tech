import { useState } from "react";
import {
  X,
  Video,
  Target,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Zap,
  Brain,
  ArrowLeft,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Step = 1 | 2 | 3 | "preview";

interface QuizCounts {
  easy: number;
  medium: number;
  hard: number;
}

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

interface FormData {
  title: string;
  subject: string;
  description: string;
  videoUrl: string;
}

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];

const MOCK_QUESTIONS: Record<"easy" | "medium" | "hard", Question[]> = {
  easy: [
    {
      text: "",
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      correctIndex: 0,
    },
    {
      text: "",
      options: [
        "Description A",
        "Description B",
        "Description C",
        "Description D",
      ],
      correctIndex: 0,
    },
    {
      text: "",
      options: ["Purpose A", "Purpose B", "Purpose C", "Purpose D"],
      correctIndex: 0,
    },
  ],
  medium: [
    {
      text: "",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
    },
    {
      text: "",
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
      correctIndex: 0,
    },
  ],
  hard: [
    {
      text: "",
      options: ["Result A", "Result B", "Result C", "Result D"],
      correctIndex: 0,
    },
  ],
};

export default function CreateContentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    title: "",
    subject: "",
    description: "",
    videoUrl: "",
  });
  const [counts, setCounts] = useState<QuizCounts>({
    easy: 3,
    medium: 2,
    hard: 1,
  });
  const [activeTab, setActiveTab] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [questions, setQuestions] = useState(MOCK_QUESTIONS);

  const wordCount = form.description.trim()
    ? form.description.trim().split(/\s+/).length
    : 0;
  const totalQuestions = counts.easy + counts.medium + counts.hard;
  const isVideoValid =
    form.videoUrl.startsWith("http://") || form.videoUrl.startsWith("https://");
  const canProceedStep1 =
    form.title.trim() && form.subject && wordCount >= 200 && isVideoValid;

  function handleClose() {
    setStep(1);
    setForm({ title: "", subject: "", description: "", videoUrl: "" });
    setCounts({ easy: 3, medium: 2, hard: 1 });
    setActiveTab("easy");
    onClose();
  }

  function adjustCount(level: keyof QuizCounts, delta: number) {
    setCounts((prev) => ({
      ...prev,
      [level]: Math.max(0, prev[level] + delta),
    }));
  }

  function setCorrect(
    level: "easy" | "medium" | "hard",
    qIdx: number,
    optIdx: number,
  ) {
    setQuestions((prev) => ({
      ...prev,
      [level]: prev[level].map((q, i) =>
        i === qIdx ? { ...q, correctIndex: optIdx } : q,
      ),
    }));
  }

  const tabQuestions = questions[activeTab].slice(0, counts[activeTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101828]/70 z-50"
          />

          {/* <div className="max-h-[80vh] overflow-y-auto"> */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 overflow-y-auto pointer-events-none hideScrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[672px] max-h-[95vh] hideScrollbar overflow-y-auto rounded-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {step === "preview" ? (
                <PreviewView
                  form={form}
                  questions={questions}
                  counts={counts}
                  onClose={handleClose}
                />
              ) : (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-[#101828] text-[22px] font-black tracking-[-0.4px]">
                        Create AI Learning Content
                      </h2>
                      <p className="text-[#6a7282] text-[13px] mt-0.5">
                        Video + AI-Generated Quiz
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center text-[#99a1af] hover:text-[#101828] transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Stepper */}
                  <Stepper currentStep={step as 1 | 2 | 3} />

                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 space-y-5"
                      >
                        {/* Info Banner */}
                        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[16px] p-4 flex gap-3">
                          <Video
                            size={18}
                            className="text-[#155dfc] shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-[#155dfc] text-[11px] font-black uppercase tracking-[0.8px]">
                              Step 1: Add Your Learning Video
                            </p>
                            <p className="text-[#3b82f6] text-[12px] mt-0.5 leading-normal">
                              Paste a video URL (YouTube, Vimeo, etc.) or upload
                              from your device. We'll use AI to generate quiz
                              questions based on this content.
                            </p>
                          </div>
                        </div>

                        {/* Title + Subject */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
                              Content Title *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Photosynthesis Explained"
                              value={form.title}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  title: e.target.value,
                                }))
                              }
                              className="w-full border border-[#e5e7eb] rounded-[12px] h-[46px] px-4 text-[14px] font-semibold text-[#101828] placeholder-[#c0c7d1] focus:outline-none focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]/30"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
                              Subject *
                            </label>
                            <div className="relative">
                              <select
                                value={form.subject}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    subject: e.target.value,
                                  }))
                                }
                                className="w-full border border-[#e5e7eb] rounded-[12px] h-[46px] px-4 text-[14px] font-semibold text-[#101828] focus:outline-none focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]/30 appearance-none bg-white"
                              >
                                <option value="" disabled>
                                  Select Subject
                                </option>
                                {SUBJECTS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99a1af] pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
                            Topic Description * (Minimum 200 Words)
                          </label>
                          <textarea
                            placeholder="Provide a detailed description of the topic. This will help the AI generate better quiz questions. Include key concepts, learning objectives, and important points students should understand..."
                            value={form.description}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                description: e.target.value,
                              }))
                            }
                            rows={6}
                            className="w-full border border-[#e5e7eb] rounded-[12px] px-4 py-3 text-[14px] text-[#101828] placeholder-[#c0c7d1] focus:outline-none focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]/30 resize-none"
                          />
                          <p
                            className={`text-[11px] mt-1 ${
                              wordCount >= 200
                                ? "text-[#00bc7d]"
                                : "text-[#99a1af]"
                            }`}
                          >
                            {wordCount} / 200 words
                          </p>
                        </div>

                        {/* Video URL */}
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
                            Video URL *
                          </label>
                          <div className="relative">
                            <Video
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99a1af]"
                            />
                            <input
                              type="text"
                              placeholder="https://youtu.be/..."
                              value={form.videoUrl}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  videoUrl: e.target.value,
                                }))
                              }
                              className="w-full border border-[#e5e7eb] rounded-[12px] h-[46px] pl-10 pr-10 text-[14px] font-semibold text-[#101828] placeholder-[#c0c7d1] focus:outline-none focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]/30"
                            />
                            {isVideoValid && (
                              <CheckCircle2
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00bc7d] fill-[#d0fae5]"
                              />
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setStep(2)}
                          disabled={!canProceedStep1}
                          className="w-full h-[52px] bg-[#155dfc] disabled:opacity-40 rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2"
                        >
                          Next: Configure Quiz
                          <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 space-y-5"
                      >
                        {/* Info Banner */}
                        <div className="bg-[#f5f3ff] border border-[#ddd6fe] rounded-[16px] p-4">
                          <p className="text-[#7c3aed] text-[11px] font-black uppercase tracking-[0.8px]">
                            Step 2: Configure Quiz Difficulty
                          </p>
                          <p className="text-[#8b5cf6] text-[12px] mt-0.5 leading-normal">
                            Select difficulty levels and number of questions. AI
                            will generate relevant questions based on your video
                            content.
                          </p>
                        </div>

                        {/* Summary Card */}
                        <div className="border border-[#e5e7eb] rounded-[14px] p-4 flex justify-between items-center">
                          <div>
                            <p className="text-[14px] font-bold text-[#101828]">
                              {form.title || "Untitled"}
                            </p>
                            <p className="text-[12px] text-[#6a7282] mt-0.5">
                              {form.subject}
                            </p>
                          </div>
                          <button
                            onClick={() => setStep(1)}
                            className="text-[#7c3aed] text-[11px] font-black uppercase tracking-[0.8px] hover:opacity-70 transition-opacity"
                          >
                            Edit Video
                          </button>
                        </div>

                        {/* Difficulty Levels */}
                        <DifficultyRow
                          label="Easy"
                          description="Basic recall & definitions"
                          color="green"
                          count={counts.easy}
                          onDecrement={() => adjustCount("easy", -1)}
                          onIncrement={() => adjustCount("easy", 1)}
                        />
                        <DifficultyRow
                          label="Medium"
                          description="Applied understanding"
                          color="yellow"
                          count={counts.medium}
                          onDecrement={() => adjustCount("medium", -1)}
                          onIncrement={() => adjustCount("medium", 1)}
                        />
                        <DifficultyRow
                          label="Hard"
                          description="Critical thinking"
                          color="red"
                          count={counts.hard}
                          onDecrement={() => adjustCount("hard", -1)}
                          onIncrement={() => adjustCount("hard", 1)}
                        />

                        {/* Total */}
                        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[14px] px-5 py-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Brain size={18} className="text-[#155dfc]" />
                            <span className="text-[#155dfc] text-[13px] font-black">
                              Total AI Questions to Generate:
                            </span>
                          </div>
                          <span className="text-[#155dfc] text-[18px] font-black">
                            {totalQuestions}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => setStep(1)}
                            className="h-[52px] px-8 border border-[#e5e7eb] rounded-[16px] text-[#101828] text-[13px] font-black uppercase tracking-[1px] hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
                          >
                            <ArrowLeft size={15} />
                            Back
                          </button>
                          <button
                            onClick={() => setStep(3)}
                            disabled={totalQuestions === 0}
                            className="flex-1 h-[52px] bg-[#155dfc] disabled:opacity-40 rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            <Zap size={15} />
                            Generate Questions with AI
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 space-y-5"
                      >
                        {/* Info Banner */}
                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[16px] p-4 flex gap-3">
                          <CheckCircle2
                            size={18}
                            className="text-[#16a34a] shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-[#16a34a] text-[11px] font-black uppercase tracking-[0.8px]">
                              Step 3: Validate & Edit AI Questions
                            </p>
                            <p className="text-[#22c55e] text-[12px] mt-0.5 leading-normal">
                              Review all questions generated by AI. Edit
                              questions, answers, or mark the correct option
                              before publishing.
                            </p>
                          </div>
                        </div>

                        {/* Tab Bar */}
                        <div className="bg-[#f3f4f6] rounded-[12px] p-1 flex">
                          {(["easy", "medium", "hard"] as const).map((lvl) => (
                            <button
                              key={lvl}
                              onClick={() => setActiveTab(lvl)}
                              className={`flex-1 justify-center relative flex items-center gap-2 px-4 py-2 rounded-[14px] cursor-pointer transition-colors text-[#6a7282] hover:bg-white/50`}
                            >
                              {activeTab === lvl && (
                                <motion.div
                                  layoutId="teacher-nav"
                                  className="absolute inset-0 bg-white shadow-sm rounded-[14px]"
                                  initial={false}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}
                              <div className="relative z-10 flex items-center gap-2">
                                <span className="text-[12px] font-black uppercase tracking-[1.2px]">
                                  {lvl}
                                </span>
                                {counts[lvl] && (
                                  <span className="bg-[#F3F4F6] text-[#0F0F0F] text-[8px] font-black px-1.5 py-0.5 rounded-full -ml-1">
                                    {counts[lvl]}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Questions */}
                        <div className="space-y-5 max-h-[340px] overflow-y-auto pr-1">
                          {tabQuestions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="border border-[#e5e7eb] rounded-[14px] p-4 space-y-3"
                            >
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af]">
                                  Question {qIdx + 1}
                                </p>
                                <span className="bg-[#eff6ff] text-[#155dfc] text-[9px] font-black uppercase tracking-[0.8px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                  AI Generated
                                </span>
                              </div>
                              <input
                                type="text"
                                value={q.text}
                                onChange={(e) =>
                                  setQuestions((prev) => ({
                                    ...prev,
                                    [activeTab]: prev[activeTab].map(
                                      (item, i) =>
                                        i === qIdx
                                          ? { ...item, text: e.target.value }
                                          : item,
                                    ),
                                  }))
                                }
                                className="w-full border border-[#e5e7eb] rounded-[10px] h-[38px] px-3 text-[13px] text-[#101828] focus:outline-none focus:border-[#155dfc]"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() =>
                                      setCorrect(activeTab, qIdx, optIdx)
                                    }
                                    className={`flex items-center justify-between border rounded-[10px] px-3 py-2.5 text-left transition-colors ${
                                      q.correctIndex === optIdx
                                        ? "border-[#00bc7d] bg-white"
                                        : "border-[#e5e7eb] bg-white"
                                    }`}
                                  >
                                    <span
                                      className={`text-[13px] font-semibold ${
                                        q.correctIndex === optIdx
                                          ? "text-[#00bc7d]"
                                          : "text-[#6a7282]"
                                      }`}
                                    >
                                      {opt}
                                    </span>
                                    {q.correctIndex === optIdx ? (
                                      <CheckCircle2
                                        size={16}
                                        className="text-[#00bc7d] fill-[#d0fae5] shrink-0"
                                      />
                                    ) : (
                                      <Circle
                                        size={16}
                                        className="text-[#d1d5db] shrink-0"
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[13px] font-black text-[#101828]">
                              Ready to Publish?
                            </p>
                            <p className="text-[11px] text-[#6a7282]">
                              Total: {totalQuestions} validated questions
                            </p>
                          </div>
                          <button
                            onClick={() => setStep(2)}
                            className="text-[#155dfc] text-[11px] font-black uppercase tracking-[0.8px] flex items-center gap-1 hover:opacity-70 transition-opacity"
                          >
                            <ArrowLeft size={12} />
                            Regenerate
                          </button>
                        </div>

                        <button
                          onClick={() => setStep("preview")}
                          className="w-full h-[52px] bg-[#155dfc] rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity"
                        >
                          Publish Video + Quiz to Students
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </div>
          {/* </div> */}
        </>
      )}
    </AnimatePresence>
  );
}

function Stepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { id: 1, label: "Video", icon: Video },
    { id: 2, label: "Quiz Setup", icon: Target },
    { id: 3, label: "Validate", icon: CheckCircle2 },
  ];

  return (
    <div className="flex items-center gap-0">
      {steps.map((s, idx) => {
        const done = currentStep > s.id;
        const active = currentStep === s.id;
        const Icon = s.icon;

        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? "bg-[#00bc7d]"
                    : active
                      ? "bg-[#155dfc]"
                      : "bg-[#f3f4f6]"
                }`}
              >
                <Icon
                  size={16}
                  className={done || active ? "text-white" : "text-[#99a1af]"}
                />
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-[0.8px] ${
                  active
                    ? "text-[#155dfc]"
                    : done
                      ? "text-[#00bc7d]"
                      : "text-[#99a1af]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-3 rounded-full transition-colors ${
                  currentStep > s.id ? "bg-[#00bc7d]" : "bg-[#e5e7eb]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function DifficultyRow({
  label,
  description,
  color,
  count,
  onDecrement,
  onIncrement,
}: {
  label: string;
  description: string;
  color: "green" | "yellow" | "red";
  count: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const colorMap = {
    green: "bg-[#f0fdf4] border-[#bbf7d0]",
    yellow: "bg-[#fefce8] border-[#fef08a]",
    red: "bg-[#fff1f2] border-[#fecdd3]",
  };

  return (
    <div
      className={`border rounded-[14px] px-5 py-4 flex justify-between items-center ${colorMap[color]}`}
    >
      <div>
        <p className="text-[14px] font-black text-[#101828] uppercase tracking-[0.5px]">
          {label}
        </p>
        <p className="text-[12px] text-[#6a7282] mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          className="w-8 h-8 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#101828] font-black hover:bg-gray-50 transition-colors"
        >
          –
        </button>
        <span className="w-5 text-center text-[16px] font-black text-[#101828]">
          {count}
        </span>
        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#101828] font-black hover:bg-gray-50 transition-colors"
        >
          +
        </button>
        <span className="text-[11px] font-black uppercase tracking-[0.8px] text-[#99a1af] ml-1">
          Questions
        </span>
      </div>
    </div>
  );
}

function PreviewView({
  form,
  questions,
  counts,
  onClose,
}: {
  form: FormData;
  questions: typeof MOCK_QUESTIONS;
  counts: QuizCounts;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const tabQuestions = questions[activeTab].slice(0, counts[activeTab]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[#101828] text-[22px] font-black tracking-[-0.4px]">
            Content Preview
          </h2>
          <p className="text-[#6a7282] text-[13px] mt-0.5">
            Review your content before publishing
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-[#99a1af] hover:text-[#101828] transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
            Content Title *
          </p>
          <div className="border border-[#e5e7eb] rounded-[10px] h-[42px] px-4 flex items-center text-[14px] font-semibold text-[#101828]">
            {form.title || "Untitled"}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
            Subject *
          </p>
          <div className="border border-[#e5e7eb] rounded-[10px] h-[42px] px-4 flex items-center text-[14px] font-semibold text-[#101828]">
            {form.subject || "—"}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
          Topic Description * (Minimum 200 Words)
        </p>
        <div className="border border-[#e5e7eb] rounded-[10px] px-4 py-3 text-[13px] text-[#101828] min-h-[90px]">
          {form.description || "—"}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
          Video URL *
        </p>
        <div className="border border-[#e5e7eb] rounded-[10px] h-[42px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video size={14} className="text-[#99a1af] shrink-0" />
            <span className="text-[13px] font-semibold text-[#101828] truncate">
              {form.videoUrl || "—"}
            </span>
          </div>
          <button className="text-[#99a1af] hover:text-[#101828] transition-colors ml-2 shrink-0">
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#f3f4f6] rounded-[12px] p-1 flex mb-4">
        {(["easy", "medium", "hard"] as const).map((lvl) => (
          // <button
          //   key={lvl}
          //   onClick={() => setActiveTab(lvl)}
          //   className={`flex-1 h-9 rounded-[10px] text-[12px] font-black uppercase tracking-[0.8px] transition-colors flex items-center justify-center gap-1.5 ${
          //     activeTab === lvl
          //       ? "bg-white shadow text-[#101828]"
          //       : "text-[#6a7282]"
          //   }`}
          // >
          //   {lvl}
          //   <span className="text-[10px] font-black">{counts[lvl]}</span>
          // </button>

          <button
            key={lvl}
            onClick={() => setActiveTab(lvl)}
            className={`flex-1 justify-center relative flex items-center gap-2 px-4 py-2 rounded-[14px] cursor-pointer transition-colors text-[#6a7282] hover:bg-white/50`}
          >
            {activeTab === lvl && (
              <motion.div
                layoutId="teacher-nav"
                className="absolute inset-0 bg-white shadow-sm rounded-[14px]"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-[12px] font-black uppercase tracking-[1.2px]">
                {lvl}
              </span>
              {counts[lvl] && (
                <span className="bg-[#F3F4F6] text-[#0F0F0F] text-[8px] font-black px-1.5 py-0.5 rounded-full -ml-1">
                  {counts[lvl]}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Questions (read-only) */}
      <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 mb-6">
        {tabQuestions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="border border-[#e5e7eb] rounded-[14px] p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af]">
                Question {qIdx + 1}
              </p>
              <span className="bg-[#eff6ff] text-[#155dfc] text-[9px] font-black uppercase tracking-[0.8px] px-2 py-0.5 rounded-full">
                AI Generated
              </span>
            </div>
            <div className="border border-[#e5e7eb] rounded-[10px] h-[38px] px-3 flex items-center text-[13px] text-[#101828]">
              {q.text || ""}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, optIdx) => (
                <div
                  key={optIdx}
                  className={`flex items-center justify-between border rounded-[10px] px-3 py-2.5 ${
                    q.correctIndex === optIdx
                      ? "border-[#00bc7d]"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  <span
                    className={`text-[13px] font-semibold ${
                      q.correctIndex === optIdx
                        ? "text-[#00bc7d]"
                        : "text-[#6a7282]"
                    }`}
                  >
                    {opt}
                  </span>
                  {q.correctIndex === optIdx ? (
                    <CheckCircle2
                      size={16}
                      className="text-[#00bc7d] fill-[#d0fae5] shrink-0"
                    />
                  ) : (
                    <Circle size={16} className="text-[#d1d5db] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full h-[52px] bg-[#374151] rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] hover:opacity-90 transition-opacity"
      >
        Close
      </button>
    </div>
  );
}
