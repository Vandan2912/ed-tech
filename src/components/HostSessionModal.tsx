import { useState } from "react";
import { X, Users, Target, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CustomSelect from "./CustomSelect";

const SUBJECT_OPTIONS = [
  { label: "Mathematics", value: "Mathematics" },
  { label: "Physics", value: "Physics" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Biology", value: "Biology" },
  { label: "History", value: "History" },
  { label: "Geography", value: "Geography" },
  { label: "Literature", value: "Literature" },
];

export default function HostSessionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [topicName, setTopicName] = useState("");
  const [subject, setSubject] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [maxLearners, setMaxLearners] = useState(4);

  const addGoal = () => {
    const trimmed = goalInput.trim();
    if (trimmed) {
      setGoals((prev) => [...prev, trimmed]);
      setGoalInput("");
    }
  };

  const removeGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGoal();
    }
  };

  const canLaunch = topicName.trim() !== "" && subject !== "" && goals.length >= 1;

  const handleClose = () => {
    setTopicName("");
    setSubject("");
    setGoals([]);
    setGoalInput("");
    setMaxLearners(4);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101828]/60 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[520px] rounded-3xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 p-7 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-[#101828] tracking-tight leading-tight">
                      Host Study Room
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Set topic &amp; goals to get started
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 shrink-0 ml-4 focus-visible:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Topic Name */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Topic Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="e.g. Algebra Basics"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[14px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Subject
                  </label>
                  <CustomSelect
                    value={subject}
                    onChange={setSubject}
                    options={SUBJECT_OPTIONS}
                    placeholder="Select a subject"
                  />
                </div>

                {/* Session Goals */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Session Goals{" "}
                    <span className="normal-case font-semibold tracking-normal text-gray-400">
                      (add at least 1)
                    </span>
                  </label>

                  {/* Existing goals */}
                  <AnimatePresence>
                    {goals.map((goal, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {i + 1}
                        </div>
                        <span className="flex-1 text-[13px] font-medium text-emerald-900">
                          {goal}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeGoal(i)}
                          className="text-emerald-400 hover:text-red-400 transition-colors focus-visible:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Goal input row */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Target size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Solve 5 practice problems together"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addGoal}
                      disabled={!goalInput.trim()}
                      className="flex items-center gap-1.5 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[12px] font-black uppercase tracking-wider rounded-2xl transition-colors focus-visible:outline-none"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Max Learners */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                      Max Learners
                    </label>
                    <span className="text-[13px] font-black text-[#1C398E]">{maxLearners}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={2}
                      max={8}
                      value={maxLearners}
                      onChange={(e) => setMaxLearners(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#1C398E]"
                      style={{
                        background: `linear-gradient(to right, #1C398EEE ${((maxLearners - 2) / 6) * 100}%, #E5E7EB ${((maxLearners - 2) / 6) * 100}%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] font-semibold text-gray-400">2 min</span>
                      <span className="text-[10px] font-semibold text-gray-400">8 max</span>
                    </div>
                  </div>
                </div>

                {/* Launch button */}
                <button
                  type="button"
                  disabled={!canLaunch}
                  className="w-full py-3.5 rounded-2xl bg-[#1C398E] hover:bg-[#162d72] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none"
                >
                  Launch Study Room 🚀
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
