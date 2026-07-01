import { useState } from "react";
import { motion } from "motion/react";
import { Brain, ChevronDown, Sparkles, TrendingUp } from "lucide-react";
const subjects = [
  { label: "Maths", emoji: "📐" },
  { label: "Physics", emoji: "⚛️" },
  { label: "Chemistry", emoji: "🧪" },
  { label: "Biology", emoji: "🧬" },
  { label: "History", emoji: "🏛️" },
  { label: "Geography", emoji: "🌍" },
];

const topicsBySubject: Record<string, string[]> = {
  Maths: ["Trigonometry", "Algebra", "Calculus", "Geometry", "Statistics"],
  Physics: ["Laws of Motion", "Thermodynamics", "Optics", "Electromagnetism"],
  Chemistry: [
    "Organic Chemistry",
    "Periodic Table",
    "Chemical Bonding",
    "Acids & Bases",
  ],
  Biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
  History: [
    "Ancient Civilizations",
    "World War I",
    "World War II",
    "Modern History",
  ],
  Geography: [
    "Physical Geography",
    "Climate",
    "Maps & Cartography",
    "Geopolitics",
  ],
};

export function ProblemOfTheDay() {
  const [selectedSubject, setSelectedSubject] = useState("Maths");
  const [selectedTopic, setSelectedTopic] = useState("Trigonometry");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);

  const currentTopics = topicsBySubject[selectedSubject] ?? [];
  const currentSubjectEmoji =
    subjects.find((s) => s.label === selectedSubject)?.emoji ?? "📐";

  const handleSubjectSelect = (label: string) => {
    setSelectedSubject(label);
    setSelectedTopic(topicsBySubject[label]?.[0] ?? "");
    setSubjectOpen(false);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setTopicOpen(false);
  };

  return (
    <section className="px-6 py-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[28px]"
        style={{
          background:
            "linear-gradient(135deg, #f0f1f8 0%, #e8eaf6 40%, #ede8f5 100%)",
          border: "1.5px solid rgba(255,255,255,0.8)",
          boxShadow: "0 4px 32px 0 rgba(109,40,217,0.08)",
        }}
      >
        {/* Decorative blobs – clipped to card only, so dropdowns can overflow */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <div
            className="absolute"
            style={{
              width: 256,
              height: 256,
              right: -80,
              top: -80,
              background:
                "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 256,
              height: 256,
              left: -80,
              bottom: -60,
              background:
                "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>

        <div className="relative z-10 p-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {/* Brain icon rounded square */}
            <div
              className="flex items-center justify-center rounded-2xl shrink-0"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
              }}
            >
              <Brain size={28} className="text-white" />
            </div>
            {/* Title + subtitle */}
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-[28px] font-black text-gray-900 leading-tight tracking-tight"
                  style={{ fontFamily: "inherit" }}
                >
                  Problem of the Day
                </h2>
                <Sparkles className="shrink-0 text-[#8b5cf6]" />
              </div>
              <p className="text-sm text-[#6A7282] mt-0.5 font-normal leading-5">
                Challenge yourself with the toughest question from your grade
              </p>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex flex-col gap-6">
            {/* 1. Choose Subject */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[1.2px] text-[#374151] mb-3">
                1. Choose Subject
              </p>
              <div className="relative">
                <button
                  onClick={() => {
                    setSubjectOpen((v) => !v);
                    setTopicOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl text-left transition-all"
                  style={{
                    border: "1.5px solid rgba(209,213,219,0.8)",
                    boxShadow: subjectOpen
                      ? "0 0 0 3px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.06)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    minHeight: 68,
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl leading-none">
                      {currentSubjectEmoji}
                    </span>
                    <span className="text-[17px] font-semibold text-gray-800">
                      {selectedSubject}
                    </span>
                  </span>
                  <ChevronDown
                    size={20}
                    className="text-gray-400 transition-transform duration-200"
                    style={{
                      transform: subjectOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {subjectOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-30"
                    style={{
                      background: "#fff",
                      border: "1.5px solid rgba(209,213,219,0.8)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    }}
                  >
                    {subjects.map((s) => (
                      <li key={s.label}>
                        <button
                          onClick={() => handleSubjectSelect(s.label)}
                          className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-violet-50 transition-colors"
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <span
                            className={`text-[15px] font-semibold ${
                              selectedSubject === s.label
                                ? "text-violet-600"
                                : "text-gray-800"
                            }`}
                          >
                            {s.label}
                          </span>
                          {selectedSubject === s.label && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-violet-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </div>

            {/* 2. Choose Topic */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[1.2px] text-[#374151] mb-3">
                2. Choose Topic
              </p>
              <div className="relative">
                <button
                  onClick={() => {
                    setTopicOpen((v) => !v);
                    setSubjectOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl text-left transition-all"
                  style={{
                    border: "1.5px solid rgba(209,213,219,0.8)",
                    boxShadow: topicOpen
                      ? "0 0 0 3px rgba(139,92,246,0.15), 0 2px 8px rgba(0,0,0,0.06)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    minHeight: 60,
                  }}
                >
                  <span className="text-[17px] font-semibold text-gray-800">
                    {selectedTopic}
                  </span>
                  <ChevronDown
                    size={20}
                    className="text-gray-400 transition-transform duration-200"
                    style={{
                      transform: topicOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {topicOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-30"
                    style={{
                      background: "#fff",
                      border: "1.5px solid rgba(209,213,219,0.8)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                    }}
                  >
                    {currentTopics.map((topic) => (
                      <li key={topic}>
                        <button
                          onClick={() => handleTopicSelect(topic)}
                          className="w-full flex items-center gap-3 px-6 py-3.5 text-left hover:bg-violet-50 transition-colors"
                        >
                          <span
                            className={`text-[15px] font-semibold ${
                              selectedTopic === topic
                                ? "text-violet-600"
                                : "text-gray-800"
                            }`}
                          >
                            {topic}
                          </span>
                          {selectedTopic === topic && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-violet-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </div>

            {/* Start Challenge Button */}
            <motion.button
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 font-black uppercase tracking-[2px] text-white transition-all"
              style={{
                background:
                  "linear-gradient(90deg, #7c3aed 0%, #6d28d9 50%, #8b5cf6 100%)",
                borderRadius: 16,
                height: 60,
                fontSize: 14,
                letterSpacing: "0.12em",
                boxShadow: "0 4px 24px rgba(109,40,217,0.40)",
              }}
            >
              <TrendingUp size={20} className="text-white" />
              START CHALLENGE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
