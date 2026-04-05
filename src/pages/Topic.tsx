import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { api } from "@/lib/api";
import { Clock, Play, Zap, BarChart3, BookOpen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Topic = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector((state) => state.course);

  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );

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

            <div className="flex flex-col items-center gap-2 min-w-[180px]">
              <button
                className="w-full bg-[#155dfc] text-white px-8 h-[44px] rounded-[16px] font-black text-[14px] uppercase tracking-[1.25px] shadow-[0px_10px_15px_0px_#bedbff,0px_4px_6px_0px_#bedbff] hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                onClick={() => setShowDifficultyModal(true)}
              >
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
                  3 attempts per difficulty level · resets daily
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AttemptCard
                label="easy"
                color="#007a55"
                bg="#ecfdf5"
                border="#d0fae5"
                accent="#a4f4cf"
                left={3}
              />
              <AttemptCard
                label="medium"
                color="#bb4d00"
                bg="#fffbeb"
                border="#fef3c6"
                accent="#fee685"
                left={3}
              />
              <AttemptCard
                label="hard"
                color="#c70036"
                bg="#fff1f2"
                border="#ffe4e6"
                accent="#ffccd3"
                left={3}
              />
            </div>
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
              setSelectedDifficulty(null);
            }}
            selectedDifficulty={selectedDifficulty}
            onSelect={setSelectedDifficulty}
            onStart={() => {
              if (selectedDifficulty) {
                navigate(
                  `/courses/${course.id}/${topic.id}/quiz?difficulty=${selectedDifficulty.toLowerCase()}`,
                );
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components
function DifficultyModal({
  topic,
  onClose,
  selectedDifficulty,
  onSelect,
  onStart,
}: any) {
  return (
    <div className="relative items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#f9fafb] w-full max-w-[896px] rounded-[32px] overflow-hidden p-8 mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#99a1af] font-medium hover:text-[#101828] transition-colors"
        >
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
          <p className="text-[#6a7282] text-[14px] text-center max-w-[450px]">
            This quiz was created by your teacher with 3 difficulty levels.
            Choose your challenge level and earn XP!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DifficultyCard
            title="Easy"
            emoji="🌱"
            desc="Core concepts · perfect for first-time learners"
            questions={3}
            attemptsLeft={2}
            xp={25}
            attempts={3}
            color="#009966"
            isSelected={selectedDifficulty === "Easy"}
            onClick={() => onSelect("Easy")}
          />
          <DifficultyCard
            title="Medium"
            emoji="⚡"
            desc="Applied knowledge · moderate challenge"
            questions={3}
            attemptsLeft={3}
            xp={50}
            attempts={3}
            color="#e17100"
            isSelected={selectedDifficulty === "Medium"}
            onClick={() => onSelect("Medium")}
          />
          <DifficultyCard
            title="Hard"
            emoji="🔥"
            desc="Advanced reasoning · for mastery seekers"
            questions={3}
            attemptsLeft={1}
            xp={100}
            attempts={3}
            color="#ec003f"
            isSelected={selectedDifficulty === "Hard"}
            onClick={() => onSelect("Hard")}
          />
        </div>

        {/* 🌟 Premium Upgrade Option (Logic: Show if any attempts used) */}
        {(1 < 3 || 3 < 3 || 2 < 3) && ( // Dynamically showing banner based on chosen states
          <div className="bg-linear-to-r from-[#fffbeb] to-[#fff7ed] border border-[#fee685] rounded-[16px] h-[82px] px-6 flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-[14px] bg-[#fef3c6] flex items-center justify-center shrink-0">
              <Zap size={20} className="text-[#973c00] fill-[#973c00]/20" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14px] font-black text-[#973c00] leading-none mb-1">
                Weekly Daily Attempts Exhausted
              </h4>
              <p className="text-[10px] font-medium text-[#e17100]">
                Upgrade to Premium for unlimited daily attempts across all
                difficulty levels.
              </p>
            </div>
            <button className="bg-[#fe9a00] h-[32px] px-6 rounded-[14px] text-white text-[10px] font-black uppercase tracking-[1.1px] hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
              Upgrade
            </button>
          </div>
        )}

        <button
          disabled={!selectedDifficulty}
          onClick={onStart}
          className={`w-full h-[56px] rounded-[16px] font-black text-[16px] uppercase tracking-[1.3px] transition-all flex items-center justify-center gap-3 ${
            selectedDifficulty
              ? "bg-[#155dfc] text-white shadow-lg cursor-pointer"
              : "bg-[#155dfc]/10 text-[#155dfc]/40 cursor-not-allowed"
          }`}
        >
          {selectedDifficulty
            ? `Start ${selectedDifficulty} Quiz`
            : "Select a Difficulty to Continue"}
        </button>
      </motion.div>
    </div>
  );
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
  onClick,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-[28px] p-6 border-2 transition-all cursor-pointer select-none h-full flex flex-col ${
        isSelected
          ? "border-[#155dfc] shadow-lg scale-[1.02]"
          : "border-[#f3f4f6] hover:border-gray-200"
      }`}
    >
      <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] mb-4">
        {emoji}
      </div>
      <h3 className="text-[18px] font-black text-[#101828] mb-2">{title}</h3>
      <p className="text-[10px] font-medium text-[#6a7282] mb-6 leading-[16px]">
        {desc}
      </p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#99a1af] uppercase">
            {questions} Questions
          </span>

          {attempts - attemptsLeft > 0 && (
            <div className="bg-[#ffc760] px-2 py-0.5 rounded-[4px] shadow-sm text-[8px] font-black text-[#815a12] uppercase tracking-[0.5px]">
              Upgrade
            </div>
          )}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg"
            style={{ backgroundColor: color + "15" }}
          >
            <Zap size={10} style={{ color }} />
            <span className="text-[9px] font-black" style={{ color }}>
              +{xp} XP
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <div className="flex gap-[4px] h-full">
            {[1, 2, 3].map((i) => {
              // Logic: attemptsLeft 1 means 2 used. 2 means 1 used. 3 means 0 used.
              // Wait, in Figma, Easy (1 left) showed 1 colored? No, 2/3 left showed 1 colored.
              // So Colored = Used.
              // Easy (356:7800) says 2/3 left -> 1 colored.
              // Medium (356:7825) says 3/3 left -> 0 colored (presumably, if following the rule).
              const used = 3 - (attemptsLeft || 3);
              const isActive = i <= used;
              return (
                <motion.div
                  key={i}
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
          style={{ color: isSelected ? "#155dfc" : color }}
        >
          {attemptsLeft}/{attempts} attempts left
        </div>
      </div>
    </motion.div>
  );
}

function AttemptCard({ label, color, bg, border, accent, left }: any) {
  return (
    <div
      className="rounded-[16px] p-4 flex flex-col items-center gap-2 group hover:shadow-md transition-all border"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <p
        className="text-[9px] font-black uppercase tracking-[1.067px]"
        style={{ color }}
      >
        {label}
      </p>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white border"
            style={{ borderColor: accent }}
          />
        ))}
      </div>
      <p className="text-[9px] font-bold" style={{ color }}>
        {left} left
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
