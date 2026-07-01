import { useState, useEffect } from "react";
import {
  X,
  Video,
  Target,
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
  Brain,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CustomSelect from "./CustomSelect";
import { api } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";

type Step = 1 | 2 | 3 | "preview";

interface QuizCounts {
  easy: number;
  medium: number;
  hard: number;
}

interface ApiOption {
  en: string;
  hi: string;
  is_correct: boolean;
}

interface ApiQuestion {
  question_en: string;
  question_hi: string;
  options: ApiOption[];
}

type GeneratedQuestions = Record<"easy" | "medium" | "hard", ApiQuestion[]>;

interface FormData {
  title: string;
  subjectId: string;
  description: string;
  videoUrl: string;
  difficulty: "easy" | "medium" | "hard";
}

export default function CreateContentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector((s) => s.course.subjects);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    title: "",
    subjectId: "",
    description: "",
    videoUrl: "",
    difficulty: "medium",
  });
  const [counts, setCounts] = useState<QuizCounts>({
    easy: 3,
    medium: 2,
    hard: 1,
  });
  const [activeTab, setActiveTab] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [topicId, setTopicId] = useState<number | null>(null);
  const [generatedQuestions, setGeneratedQuestions] =
    useState<GeneratedQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    if (isOpen && subjects.length === 0) {
      dispatch(fetchCourses());
    }
  }, [isOpen, subjects.length, dispatch]);

  const wordCount = form.description.trim()
    ? form.description.trim().split(/\s+/).length
    : 0;
  const totalQuestions = counts.easy + counts.medium + counts.hard;
  const isVideoValid =
    form.videoUrl.startsWith("http://") || form.videoUrl.startsWith("https://");
  const canProceedStep1 =
    form.title.trim() && form.subjectId && wordCount >= 200 && isVideoValid;

  function handleClose() {
    setStep(1);
    setForm({
      title: "",
      subjectId: "",
      description: "",
      videoUrl: "",
      difficulty: "medium",
    });
    setCounts({ easy: 3, medium: 2, hard: 1 });
    setActiveTab("easy");
    setTopicId(null);
    setGeneratedQuestions(null);
    setError(null);
    onClose();
  }

  function adjustCount(level: keyof QuizCounts, delta: number) {
    setCounts((prev) => ({
      ...prev,
      [level]: Math.max(0, prev[level] + delta),
    }));
  }

  async function handleCreateTopic() {
    if (!canProceedStep1) return;
    if (topicId) {
      setStep(2);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/course/topic", {
        subject_id: parseInt(form.subjectId),
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        youtube_url: form.videoUrl,
      });
      setTopicId(res.data.data.topic.id);
      setStep(2);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Failed to create topic. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateQuestions() {
    if (!topicId || totalQuestions === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/course/generate", {
        topic_id: topicId,
        easy: counts.easy,
        medium: counts.medium,
        hard: counts.hard,
      });
      setGeneratedQuestions(res.data.questions);
      setActiveTab("easy");
      setStep(3);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!topicId || !generatedQuestions) return;
    setLoading(true);
    setError(null);
    try {
      await api.post("/course/publish", {
        topic_id: topicId,
        questions: generatedQuestions,
      });
      setStep("preview");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function setCorrectOption(
    level: "easy" | "medium" | "hard",
    qIdx: number,
    optIdx: number,
  ) {
    setGeneratedQuestions((prev) => ({
      ...prev!,
      [level]: prev![level].map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                is_correct: j === optIdx,
              })),
            }
          : q,
      ),
    }));
  }

  function updateQuestionText(
    level: "easy" | "medium" | "hard",
    qIdx: number,
    text: string,
    activeLang: "en" | "hi",
  ) {
    const field = activeLang === "en" ? "question_en" : "question_hi";
    setGeneratedQuestions((prev) => ({
      ...prev!,
      [level]: prev![level].map((q, i) =>
        i === qIdx ? { ...q, [field]: text } : q,
      ),
    }));
  }

  const subjectOptions = subjects.map((s) => ({
    label: s.name,
    value: s.id.toString(),
  }));

  const tabQuestions = generatedQuestions ? generatedQuestions[activeTab] : [];

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

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 overflow-y-auto pointer-events-none hideScrollbar">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[672px] max-h-[95vh] hideScrollbar overflow-y-auto rounded-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}>
              {step === "preview" ? (
                <SuccessView onClose={handleClose} />
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
                      className="w-8 h-8 flex items-center justify-center text-[#99a1af] hover:text-[#101828] transition-colors">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Stepper */}
                  <Stepper currentStep={step as 1 | 2 | 3} />

                  {/* Error Banner */}
                  {error && (
                    <div className="mt-4 bg-[#fff1f2] border border-[#fecdd3] rounded-[12px] px-4 py-3 flex justify-between items-center">
                      <p className="text-[#e11d48] text-[12px] font-semibold">
                        {error}
                      </p>
                      <button
                        onClick={() => setError(null)}
                        className="text-[#e11d48] ml-3 shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Step Content */}
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 space-y-5">
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
                              Paste a YouTube URL and fill in the topic details.
                              AI will generate quiz questions based on the
                              description.
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
                            <CustomSelect
                              value={form.subjectId}
                              onChange={(val) =>
                                setForm((f) => ({ ...f, subjectId: val }))
                              }
                              placeholder="Select Subject"
                              options={subjectOptions}
                              className="w-full border bg-white border-[#e5e7eb]! rounded-[12px] h-[46px] px-4 text-[14px] font-semibold text-[#101828]! placeholder-[#c0c7d1]! focus:outline-none focus:border-[#155dfc] focus:ring-1 focus:ring-[#155dfc]/30"
                            />
                          </div>
                        </div>

                        {/* Topic Difficulty */}
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[1px] text-[#99a1af] mb-1.5">
                            Topic Difficulty *
                          </label>
                          <div className="flex gap-2">
                            {(["easy", "medium", "hard"] as const).map((d) => {
                              const colorMap = {
                                easy: {
                                  active:
                                    "bg-[#f0fdf4] border-[#16a34a] text-[#16a34a]",
                                  inactive: "border-[#e5e7eb] text-[#6a7282]",
                                },
                                medium: {
                                  active:
                                    "bg-[#fefce8] border-[#ca8a04] text-[#ca8a04]",
                                  inactive: "border-[#e5e7eb] text-[#6a7282]",
                                },
                                hard: {
                                  active:
                                    "bg-[#fff1f2] border-[#e11d48] text-[#e11d48]",
                                  inactive: "border-[#e5e7eb] text-[#6a7282]",
                                },
                              };
                              const isActive = form.difficulty === d;
                              return (
                                <button
                                  key={d}
                                  onClick={() =>
                                    setForm((f) => ({ ...f, difficulty: d }))
                                  }
                                  className={`flex-1 h-[46px] border rounded-[12px] text-[12px] font-black uppercase tracking-[0.8px] transition-colors ${
                                    isActive
                                      ? colorMap[d].active
                                      : colorMap[d].inactive
                                  }`}>
                                  {d}
                                </button>
                              );
                            })}
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
                            }`}>
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
                          onClick={handleCreateTopic}
                          disabled={!canProceedStep1 || loading}
                          className="w-full h-[52px] bg-[#155dfc] disabled:opacity-40 rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2">
                          {loading ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              Creating Topic...
                            </>
                          ) : (
                            <>
                              Next: Configure Quiz
                              <ChevronRight size={16} />
                            </>
                          )}
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
                        className="mt-6 space-y-5">
                        {/* Info Banner */}
                        <div className="bg-[#f5f3ff] border border-[#ddd6fe] rounded-[16px] p-4">
                          <p className="text-[#7c3aed] text-[11px] font-black uppercase tracking-[0.8px]">
                            Step 2: Configure Quiz Difficulty
                          </p>
                          <p className="text-[#8b5cf6] text-[12px] mt-0.5 leading-normal">
                            Select how many questions to generate per difficulty
                            level. AI will generate them from your topic
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
                              {
                                subjects.find(
                                  (s) => s.id.toString() === form.subjectId,
                                )?.name
                              }
                            </p>
                          </div>
                          <button
                            onClick={() => setStep(1)}
                            className="text-[#7c3aed] text-[11px] font-black uppercase tracking-[0.8px] hover:opacity-70 transition-opacity">
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
                            className="h-[52px] px-8 border border-[#e5e7eb] rounded-[16px] text-[#101828] text-[13px] font-black uppercase tracking-[1px] hover:bg-[#f9fafb] transition-colors flex items-center gap-2">
                            <ArrowLeft size={15} />
                            Back
                          </button>
                          <button
                            onClick={handleGenerateQuestions}
                            disabled={totalQuestions === 0 || loading}
                            className="flex-1 h-[52px] bg-[#155dfc] disabled:opacity-40 rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            {loading ? (
                              <>
                                <Loader2 size={15} className="animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap size={15} />
                                Generate Questions with AI
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && generatedQuestions && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 space-y-5">
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

                        {/* Tab Bar + Language Toggle */}
                        <div className="flex items-center gap-2">
                          <div className="bg-[#f3f4f6] rounded-[12px] p-1 flex flex-1">
                            {(["easy", "medium", "hard"] as const).map(
                              (lvl) => (
                                <button
                                  key={lvl}
                                  onClick={() => setActiveTab(lvl)}
                                  className="flex-1 justify-center relative flex items-center gap-2 px-4 py-2 rounded-[14px] cursor-pointer transition-colors text-[#6a7282] hover:bg-white/50">
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
                                    {generatedQuestions[lvl].length > 0 && (
                                      <span className="bg-[#F3F4F6] text-[#0F0F0F] text-[8px] font-black px-1.5 py-0.5 rounded-full -ml-1">
                                        {generatedQuestions[lvl].length}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Language Toggle */}
                        <div className="flex flex-col gap-1">
                          <p className="text-[9px] text-[#99A1AF] font-black uppercase tracking-[1.2px]">
                            Select Language{" "}
                            <span className="text-red-500">*</span>
                          </p>
                          <div className="flex items-center bg-[#F3F4F6] border border-[#E5E7EBCC] rounded-full p-1 gap-0.5 w-fit">
                            <button
                              onClick={() => setLang("en")}
                              className={`px-3 py-1 rounded-full text-[11px] font-black tracking-[0.8px] uppercase transition-all ${
                                lang === "en"
                                  ? "bg-white text-[#101828] shadow-sm"
                                  : "text-[#6A7282] hover:text-[#101828]"
                              }`}>
                              EN
                            </button>
                            <button
                              onClick={() => setLang("hi")}
                              className={`px-3 py-1 rounded-full text-[12px] font-black transition-all ${
                                lang === "hi"
                                  ? "bg-white text-[#101828] shadow-sm"
                                  : "text-[#6A7282] hover:text-[#101828]"
                              }`}>
                              हिं
                            </button>
                          </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-5 overflow-y-auto pr-1">
                          {tabQuestions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="border border-[#e5e7eb] rounded-[14px] p-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-black uppercase tracking-[1px] text-[#99a1af]">
                                  Question {qIdx + 1}
                                </p>
                                <span className="bg-[#eff6ff] border border-[#dbeafe] text-[#155dfc] text-[9px] font-black uppercase tracking-[1.067px] px-2 py-0.5 rounded-full">
                                  AI Generated
                                </span>
                              </div>
                              <input
                                type="text"
                                value={
                                  lang === "en" ? q.question_en : q.question_hi
                                }
                                onChange={(e) =>
                                  updateQuestionText(
                                    activeTab,
                                    qIdx,
                                    e.target.value,
                                    lang,
                                  )
                                }
                                className={`w-full border border-[#e5e7eb] rounded-[10px] h-[38px] px-3 text-[13px] text-[#101828] focus:outline-none focus:border-[#155dfc] ${lang === "hi" ? "font-medium" : ""}`}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() =>
                                      setCorrectOption(activeTab, qIdx, optIdx)
                                    }
                                    className={`flex items-center justify-between border rounded-[10px] px-3 py-2.5 text-left transition-colors ${
                                      opt.is_correct
                                        ? "border-[#00bc7d] bg-white"
                                        : "border-[#e5e7eb] bg-white"
                                    }`}>
                                    <span
                                      className={`text-[13px] font-semibold ${
                                        opt.is_correct
                                          ? "text-[#00bc7d]"
                                          : "text-[#6a7282]"
                                      } ${lang === "hi" ? "font-medium" : ""}`}>
                                      {lang === "en" ? opt.en : opt.hi}
                                    </span>
                                    {opt.is_correct ? (
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
                        </div>

                        <button
                          onClick={handlePublish}
                          disabled={loading}
                          className="w-full h-[52px] bg-[#155dfc] disabled:opacity-40 rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            "Publish Video + Quiz to Students"
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </div>
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
                }`}>
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
                }`}>
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
      className={`border rounded-[14px] px-5 py-4 flex justify-between items-center ${colorMap[color]}`}>
      <div>
        <p className="text-[14px] font-black text-[#101828] uppercase tracking-[0.5px]">
          {label}
        </p>
        <p className="text-[12px] text-[#6a7282] mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrement}
          className="w-8 h-8 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#101828] font-black hover:bg-gray-50 transition-colors">
          –
        </button>
        <span className="w-5 text-center text-[16px] font-black text-[#101828]">
          {count}
        </span>
        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#101828] font-black hover:bg-gray-50 transition-colors">
          +
        </button>
        <span className="text-[11px] font-black uppercase tracking-[0.8px] text-[#99a1af] ml-1">
          Questions
        </span>
      </div>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 size={32} className="text-[#16a34a]" />
      </div>
      <h2 className="text-[#101828] text-[22px] font-black tracking-[-0.4px] mb-2">
        Published Successfully!
      </h2>
      <p className="text-[#6a7282] text-[13px] mb-8 leading-relaxed max-w-[360px]">
        Your topic and AI-generated quiz have been published. Students can now
        access the video and take the quiz.
      </p>
      <button
        onClick={onClose}
        className="w-full h-[52px] bg-[#155dfc] rounded-[16px] text-white text-[13px] font-black uppercase tracking-[1.2px] shadow-[0px_10px_25px_0px_#bedbff] hover:opacity-90 transition-opacity">
        Done
      </button>
    </div>
  );
}
