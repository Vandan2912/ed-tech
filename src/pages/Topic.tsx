import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { api } from "@/lib/api";
import { Clock, Play, Zap, BarChart3, BookOpen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizMode {
  id: number;
  title: string;
  difficulty: string;
  passing_score: number;
  xp_reward: number;
  max_attempts_per_day: number;
  passed: boolean;
  total_attempts: number;
}

interface DifficultyMeta {
  title: string;
  emoji: string;
  desc: string;
  color: string;
  // Palette used by the small "Quiz Attempts Today" summary card.
  attemptColor: string;
  attemptBg: string;
  attemptBorder: string;
  attemptAccent: string;
}

const DIFFICULTY_META: Record<string, DifficultyMeta> = {
  easy: {
    title: "Easy",
    emoji: "🌱",
    desc: "Core concepts · perfect for first-time learners",
    color: "#009966",
    attemptColor: "#007a55",
    attemptBg: "#ecfdf5",
    attemptBorder: "#d0fae5",
    attemptAccent: "#a4f4cf",
  },
  medium: {
    title: "Medium",
    emoji: "⚡",
    desc: "Applied knowledge · moderate challenge",
    color: "#e17100",
    attemptColor: "#bb4d00",
    attemptBg: "#fffbeb",
    attemptBorder: "#fef3c6",
    attemptAccent: "#fee685",
  },
  hard: {
    title: "Hard",
    emoji: "🔥",
    desc: "Advanced reasoning · for mastery seekers",
    color: "#ec003f",
    attemptColor: "#c70036",
    attemptBg: "#fff1f2",
    attemptBorder: "#ffe4e6",
    attemptAccent: "#ffccd3",
  },
};

const FALLBACK_META: DifficultyMeta = {
  title: "Quiz",
  emoji: "🎯",
  desc: "Quiz",
  color: "#155dfc",
  attemptColor: "#155dfc",
  attemptBg: "#eff6ff",
  attemptBorder: "#dbeafe",
  attemptAccent: "#bedbff",
};

const Topic = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector((state) => state.course);

  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  // Quiz modes returned by GET /course/quiz/:topicId — one entry per difficulty.
  const [quizModes, setQuizModes] = useState<QuizMode[]>([]);
  const [modesLoading, setModesLoading] = useState(false);
  const [modesError, setModesError] = useState<string | null>(null);

  // Fetch quiz modes for this topic up front — both the modal and the
  // "Quiz Attempts Today" summary card need the same data.
  useEffect(() => {
    if (!topicId) return;
    let cancelled = false;
    const fetchModes = async () => {
      setModesLoading(true);
      setModesError(null);
      try {
        const res = await api.get(`/course/quiz/${topicId}`);
        if (!cancelled) setQuizModes(res.data || []);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch quiz modes", err);
        setModesError("Failed to load quiz modes");
        setQuizModes([]);
      } finally {
        if (!cancelled) setModesLoading(false);
      }
    };
    fetchModes();
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const openQuizModes = () => {
    setShowDifficultyModal(true);
    setSelectedQuizId(null);
  };

  const selectedMode = quizModes.find((m) => m.id === selectedQuizId) || null;

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, subjects.length]);

  const course = subjects.find((c) => c.id === Number(courseId));
  const topic = course?.topics?.find((t) => t.id === Number(topicId));

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!topicId) return;
      try {
        const res = await api.get(`/course/video/${topicId}`);
        const data = res.data;
        if (data && data.length > 0 && data[0].youtube_video_id) {
          setVideoUrl(
            `https://www.youtube.com/embed/${data[0].youtube_video_id}?controls=1&rel=0`,
          );
        }
      } catch (err) {
        console.error("Failed to fetch video details", err);
      }
    };
    fetchVideo();
  }, [topicId]);

  if (loading && subjects.length === 0) {
    return <h2 className="p-6 min-h-[55vh]">Loading...</h2>;
  }

  if (!course || !topic)
    return <h2 className="p-6 min-h-[55vh]">Topic not found</h2>;

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 md:pb-12">
      {!showDifficultyModal && (
        <div className="max-w-5xl mx-auto px-4 pt-8 md:px-8">
          {/* 🎥 Video Container */}
          <div className="bg-black aspect-video rounded-[32px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] mb-8">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl || ""}
              title={topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* 📘 Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#eff6ff] border border-[#dbeafe] text-[#155dfc] text-[9px] font-black uppercase tracking-[1.067px] px-2 py-0.5 rounded-full">
                  {course.name}
                </span>
                <span className="bg-[#fffbeb] border border-[#fef3c6] text-[#e17100] text-[9px] font-black uppercase tracking-[1.067px] px-2 py-0.5 rounded-full">
                  Medium
                </span>
                <div className="flex items-center gap-1 text-[#99a1af] text-[9px] font-bold ml-2">
                  <Clock size={12} />
                  <span>18:30</span>
                </div>
              </div>

              <h1 className="text-[32px] font-black text-[#101828] tracking-tight mb-4">
                {topic.title}
              </h1>

              <p className="text-[#4a5565] text-[14px] leading-[22.75px] max-w-2xl">
                Algebra is the foundation of all advanced mathematics. In this
                lesson, you'll explore variables, expressions, and equations —
                learning how to manipulate unknowns to solve real-world
                problems. From linear equations to balancing both sides of an
                expression, this module sets you up for success across science,
                technology, and finance.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 min-w-45">
              <button
                className="w-full bg-[#155dfc] text-white px-8 h-11 rounded-[16px] font-black text-[14px] uppercase tracking-[1.25px] shadow-[0px_10px_15px_0px_#bedbff,0px_4px_6px_0px_#bedbff] hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                onClick={openQuizModes}>
                <div className="w-4 h-4 flex items-center justify-center">
                  <Play
                    size={16}
                    fill="white"
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>
                Take Quiz
              </button>
              <div className="flex items-center gap-2 text-[#99a1af] text-[10px]">
                <Zap size={12} className="text-[#99a1af]" />
                <span>+25 XP per correct answer</span>
              </div>
            </div>
          </div>

          {/* 📊 Quiz Attempts Today */}
          <div className="bg-white border border-[#f3f4f6] rounded-[28px] shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-8 h-8 rounded-[14px] bg-[#dbeafe] flex items-center justify-center">
                <BarChart3 size={16} className="text-[#155dfc]" />
              </div>
              <div>
                <h3 className="text-[12px] font-black text-[#101828] uppercase tracking-[0.6px]">
                  Quiz Attempts Today
                </h3>
                <p className="text-[10px] text-[#99a1af]">
                  {quizModes.length > 0
                    ? `${quizModes[0].max_attempts_per_day} attempts per difficulty level · resets daily`
                    : "Resets daily"}
                </p>
              </div>
            </div>

            {modesLoading ? (
              <div className="text-[12px] text-[#6a7282] py-4">
                Loading attempts...
              </div>
            ) : modesError ? (
              <div className="text-[12px] text-red-500 py-4">{modesError}</div>
            ) : quizModes.length === 0 ? (
              <div className="text-[12px] text-[#6a7282] py-4">
                No quizzes available yet.
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-6 ${
                  quizModes.length === 1
                    ? "md:grid-cols-1"
                    : quizModes.length === 2
                      ? "md:grid-cols-2"
                      : "md:grid-cols-3"
                }`}>
                {quizModes.map((mode) => {
                  const meta =
                    DIFFICULTY_META[mode.difficulty] || FALLBACK_META;
                  const attemptsLeft = Math.max(
                    0,
                    mode.max_attempts_per_day - mode.total_attempts,
                  );
                  return (
                    <AttemptCard
                      key={mode.id}
                      label={mode.difficulty}
                      color={meta.attemptColor}
                      bg={meta.attemptBg}
                      border={meta.attemptBorder}
                      accent={meta.attemptAccent}
                      left={attemptsLeft}
                      total={mode.max_attempts_per_day}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 🎓 Learning Outcomes */}
          <div className="bg-white border border-[#f3f4f6] rounded-[28px] shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8 px-1">
              <div className="w-8 h-8 rounded-[14px] bg-[#d0fae5] flex items-center justify-center">
                <BookOpen size={16} className="text-[#00bc7d]" />
              </div>
              <h3 className="text-[14px] font-black text-[#101828] uppercase tracking-[0.55px]">
                What You'll Learn
              </h3>
            </div>

            <div className="space-y-4 px-2">
              <OutcomeItem
                num={1}
                text="Variables, constants, and algebraic expressions"
              />
              <OutcomeItem
                num={2}
                text="Solving one- and two-step linear equations"
              />
              <OutcomeItem num={3} text="Simplifying and expanding brackets" />
              <OutcomeItem
                num={4}
                text="Using algebra to model real-world situations"
              />
              <OutcomeItem num={5} text="Introduction to inequalities" />
            </div>
          </div>
        </div>
      )}
      {/* 🧩 Difficulty Selection Modal */}
      <AnimatePresence>
        {showDifficultyModal && (
          <DifficultyModal
            topic={topic}
            onClose={() => {
              setShowDifficultyModal(false);
              setSelectedQuizId(null);
            }}
            modes={quizModes}
            loading={modesLoading}
            error={modesError}
            selectedQuizId={selectedQuizId}
            onSelect={setSelectedQuizId}
            onStart={() => {
              if (!selectedMode) return;
              navigate(
                `/courses/${course.id}/${topic.id}/quiz?quizId=${selectedMode.id}&difficulty=${selectedMode.difficulty}`,
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components
interface DifficultyModalProps {
  topic: { title: string };
  onClose: () => void;
  modes: QuizMode[];
  loading: boolean;
  error: string | null;
  selectedQuizId: number | null;
  onSelect: (id: number) => void;
  onStart: () => void;
}

function DifficultyModal({
  topic,
  onClose,
  modes,
  loading,
  error,
  selectedQuizId,
  onSelect,
  onStart,
}: DifficultyModalProps) {
  const selectedMode = modes.find((m) => m.id === selectedQuizId) || null;
  const anyExhausted = modes.some(
    (m) => m.total_attempts >= m.max_attempts_per_day,
  );
  const selectedTitle = selectedMode
    ? DIFFICULTY_META[selectedMode.difficulty]?.title || selectedMode.difficulty
    : null;

  return (
    <div className="relative items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#f9fafb] w-full max-w-4xl rounded-[32px] overflow-hidden p-8 mx-auto">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#99a1af] font-medium hover:text-[#101828] transition-colors">
          <ArrowLeft size={16} />
          Back to Lesson
        </button>

        <div className="flex flex-col items-center mt-12 mb-12">
          <div className="bg-[#eff6ff] border border-[#dbeafe] px-4 py-1.5 rounded-full flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#155dfc]" />
            <span className="text-[10px] font-black text-[#155dfc] uppercase tracking-[1.1px]">
              Teacher-Created Quiz
            </span>
          </div>
          <h2 className="text-[32px] font-black text-[#101828] mb-4">
            {topic.title}
          </h2>
          <p className="text-[#6a7282] text-[14px] text-center max-w-112.5">
            {modes.length > 0
              ? `This quiz was created by your teacher with ${modes.length} difficulty ${modes.length === 1 ? "level" : "levels"}. Choose your challenge level and earn XP!`
              : "Choose your challenge level and earn XP!"}
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#6a7282] py-12">
            Loading quiz modes...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : modes.length === 0 ? (
          <div className="text-center text-[#6a7282] py-12">
            No quizzes available for this topic yet.
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 mb-8 ${
              modes.length === 1
                ? "md:grid-cols-1 max-w-md mx-auto"
                : modes.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
            }`}>
            {modes.map((mode) => {
              const meta = DIFFICULTY_META[mode.difficulty] || {
                title: mode.difficulty,
                emoji: "🎯",
                desc: mode.title,
                color: "#155dfc",
              };
              const attemptsLeft = Math.max(
                0,
                mode.max_attempts_per_day - mode.total_attempts,
              );
              const exhausted = attemptsLeft === 0;
              return (
                <DifficultyCard
                  key={mode.id}
                  title={meta.title}
                  emoji={meta.emoji}
                  desc={meta.desc}
                  questions={3}
                  attemptsLeft={attemptsLeft}
                  attempts={mode.max_attempts_per_day}
                  xp={mode.xp_reward}
                  color={meta.color}
                  exhausted={exhausted}
                  isSelected={selectedQuizId === mode.id}
                  onClick={() => {
                    if (!exhausted) onSelect(mode.id);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* 🌟 Premium Upgrade Banner — show if at least one mode is exhausted */}
        {anyExhausted && (
          <div className="bg-linear-to-r from-[#fffbeb] to-[#fff7ed] border border-[#fee685] rounded-[16px] h-20.5 px-6 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-[14px] bg-[#fef3c6] flex items-center justify-center shrink-0">
              <Zap size={20} className="text-[#973c00] fill-[#973c00]/20" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-black text-[#973c00] leading-none mb-1">
                Daily Attempts Exhausted
              </h4>
              <p className="text-[10px] font-medium text-[#e17100]">
                Upgrade to Premium for unlimited daily attempts across all
                difficulty levels.
              </p>
            </div>
            <button className="bg-[#fe9a00] h-8 px-6 rounded-[14px] text-white text-[10px] font-black uppercase tracking-[1.1px] hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
              Upgrade
            </button>
          </div>
        )}

        <button
          disabled={!selectedMode}
          onClick={onStart}
          className={`w-full h-14 rounded-[16px] font-black text-[16px] uppercase tracking-[1.3px] transition-all flex items-center justify-center gap-3 ${
            selectedMode
              ? "bg-[#155dfc] text-white shadow-lg cursor-pointer"
              : "bg-[#155dfc]/10 text-[#155dfc]/40 cursor-not-allowed"
          }`}>
          {selectedTitle
            ? `Start ${selectedTitle} Quiz`
            : "Select a Difficulty to Continue"}
        </button>
      </motion.div>
    </div>
  );
}

interface DifficultyCardProps {
  title: string;
  emoji: string;
  desc: string;
  questions: number;
  attemptsLeft: number;
  xp: number;
  attempts: number;
  color: string;
  isSelected: boolean;
  exhausted: boolean;
  onClick: () => void;
}

function DifficultyCard({
  title,
  emoji,
  desc,
  questions,
  attemptsLeft,
  xp,
  attempts,
  color,
  isSelected,
  exhausted,
  onClick,
}: DifficultyCardProps) {
  return (
    <motion.div
      whileHover={exhausted ? undefined : { y: -4 }}
      whileTap={exhausted ? undefined : { scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-[28px] p-6 border-2 transition-all select-none h-full flex flex-col ${
        exhausted
          ? "border-[#f3f4f6] opacity-60 cursor-not-allowed"
          : isSelected
            ? "border-[#155dfc] shadow-lg scale-[1.02] cursor-pointer"
            : "border-[#f3f4f6] hover:border-gray-200 cursor-pointer"
      }`}>
      <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] mb-4">
        {emoji}
      </div>
      <h3 className="text-[18px] font-black text-[#101828] mb-2">{title}</h3>
      <p className="text-[10px] font-medium text-[#6a7282] mb-6 leading-4">
        {desc}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#99a1af] uppercase">
            {questions} Questions
          </span>

          {exhausted && (
            <div className="bg-[#ffc760] px-2 py-0.5 rounded-lg shadow-sm text-[8px] font-black text-[#815a12] uppercase tracking-[0.5px]">
              Upgrade
            </div>
          )}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg"
            style={{ backgroundColor: color + "15" }}>
            <Zap size={10} style={{ color }} />
            <span className="text-[9px] font-black" style={{ color }}>
              +{xp} XP
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <div className="flex gap-1 h-full">
            {Array.from({ length: attempts }, (_, idx) => {
              // Coloured segments represent attempts already used today.
              const used = attempts - attemptsLeft;
              const isActive = idx < used;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="flex-1 h-full rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isActive
                      ? isSelected
                        ? "#155dfc"
                        : color
                      : "#f3f4f6",
                    transformOrigin: "left",
                  }}
                />
              );
            })}
          </div>
        </div>
        <div
          className="text-[9px] font-bold"
          style={{ color: isSelected ? "#155dfc" : color }}>
          {exhausted
            ? "No attempts left today"
            : `${attemptsLeft}/${attempts} attempts left`}
        </div>
      </div>
    </motion.div>
  );
}

interface AttemptCardProps {
  label: string;
  color: string;
  bg: string;
  border: string;
  accent: string;
  left: number;
  total: number;
}

function AttemptCard({
  label,
  color,
  bg,
  border,
  accent,
  left,
  total,
}: AttemptCardProps) {
  const used = Math.max(0, total - left);
  return (
    <div
      className="rounded-[16px] p-4 flex flex-col items-center gap-2 group hover:shadow-md transition-all border"
      style={{ backgroundColor: bg, borderColor: border }}>
      <p
        className="text-[9px] font-black uppercase tracking-[1.067px]"
        style={{ color }}>
        {label}
      </p>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          // Filled dots represent attempts already used today.
          const isUsed = i < used;
          return (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full border"
              style={{
                borderColor: accent,
                backgroundColor: isUsed ? accent : "#ffffff",
              }}
            />
          );
        })}
      </div>
      <p className="text-[9px] font-bold" style={{ color }}>
        {left === 0 ? "No attempts left" : `${left} left`}
      </p>
    </div>
  );
}

function OutcomeItem({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-6 h-6 rounded-lg bg-[#d0fae5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <span className="text-[10px] font-black text-[#007a55]">{num}</span>
      </div>
      <p className="text-[14px] text-[#364153] leading-relaxed group-hover:text-[#101828] transition-colors">
        {text}
      </p>
    </div>
  );
}

export default Topic;
