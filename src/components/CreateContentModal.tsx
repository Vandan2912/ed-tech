import { useState } from "react";
import { X, Play, FileText, Upload, Plus, CheckCircle2, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ContentType = "LESSON" | "QUIZ";

export default function CreateContentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [type, setType] = useState<ContentType>("LESSON");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101828]/70 z-50 transition-opacity"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-10 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[672px] rounded-[40px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#f3f4f6] p-8 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[#101828] text-[20px] font-black tracking-[-0.4492px]">
                  Create New Content
                </h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-[#f9fafb] hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-500 shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="bg-[#f3f4f6] p-1.5 rounded-[16px] flex relative mb-8">
                {["LESSON", "QUIZ"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setType(tab as ContentType)}
                    className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-[14px] text-[14px] font-black tracking-[-0.1504px] relative z-10 transition-colors ${
                      type === tab ? (tab === "LESSON" ? "text-[#155dfc]" : "text-[#9810fa]") : "text-[#6a7282]"
                    }`}
                  >
                    {tab === "LESSON" ? <Play size={16} /> : <FileText size={16} />}
                    {tab === "LESSON" ? "Lesson" : "Quiz"}
                  </button>
                ))}
                {/* Active Pill Background */}
                <motion.div
                  layoutId="content-tab-pill"
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] z-0"
                  initial={false}
                  animate={{
                    left: type === "LESSON" ? "6px" : "calc(50% + 1.5px)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </div>

              {/* Form Content */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {type === "LESSON" ? (
                    <motion.div
                      key="lesson"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <TextInput label="Lesson Title *" placeholder="e.g. Introduction to Trigonometry" />
                      <SelectInput label="Subject *" placeholder="Select..." />
                      
                      {/* Text Area */}
                      <div className="relative">
                        <label className="absolute -top-1.5 left-4 bg-white px-1 text-[10px] font-black uppercase tracking-[1.1172px] text-[#99a1af] z-10">
                          Description
                        </label>
                        <textarea
                          placeholder="Describe what students will learn..."
                          className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[16px] px-5 py-4 text-[16px] font-bold text-[#101828] placeholder-[rgba(16,24,40,0.5)] tracking-[-0.3125px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/20 h-24 resize-none"
                        />
                      </div>

                      <TextInput label="Video URL" placeholder="https://youtube.com/watch?v=..." />

                      {/* Dropzone */}
                      <div className="border-2 border-dashed border-[#e5e7eb] rounded-[24px] h-[151px] flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                        <Upload size={32} className="text-[#99a1af] mb-4 group-hover:text-[#155dfc] transition-colors" />
                        <p className="text-[#6a7282] text-[14px] font-bold tracking-[-0.1504px] mb-1">Upload supporting materials</p>
                        <p className="text-[#99a1af] text-[10px] tracking-[0.1172px]">PDF, PPT, or DOC (max 50MB)</p>
                      </div>

                      <button className="w-full h-[52px] bg-[#155dfc] rounded-[16px] text-white text-[14px] font-black uppercase tracking-[1.2496px] shadow-[0px_20px_25px_0px_#bedbff,0px_8px_10px_0px_#bedbff] hover:opacity-90 transition-opacity mt-4">
                        Publish Lesson
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <TextInput label="Quiz Title *" placeholder="Quiz name" />
                        <SelectInput label="Subject *" placeholder="Select..." />
                      </div>

                      <div className="flex justify-between items-center mt-2 mb-2">
                        <p className="text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px]">Questions (1)</p>
                        <button className="flex items-center gap-1.5 text-[#155dfc] bg-[#eff6ff] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[1.06px] hover:bg-blue-100 transition-colors">
                          <Plus size={12} />
                          Add Question
                        </button>
                      </div>

                      {/* Mock Question Block */}
                      <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-[24px] p-6 space-y-4">
                         <div className="flex justify-between items-center mb-1">
                            <p className="text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px]">Question 1</p>
                         </div>
                         <input
                          type="text"
                          placeholder="Enter question..."
                          className="w-full bg-white border border-[#f3f4f6] rounded-[12px] px-4 py-3 text-[14px] font-bold text-[#101828] placeholder-[rgba(16,24,40,0.5)] focus:outline-none focus:ring-2 focus:ring-[#9810fa]/20"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <OptionInput value="Option 1" checked />
                          <OptionInput value="Option 2" />
                          <OptionInput value="Option 3" />
                          <OptionInput value="Option 4" />
                        </div>
                      </div>

                      <button className="w-full h-[52px] bg-[#9810fa] rounded-[16px] text-white text-[14px] font-black uppercase tracking-[1.2496px] shadow-[0px_20px_25px_0px_#e9d5ff,0px_8px_10px_0px_#e9d5ff] hover:opacity-90 transition-opacity mt-4">
                        Publish Quiz
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helpers
function TextInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="relative">
      <label className="absolute -top-1.5 left-4 bg-white px-1 text-[10px] font-black uppercase tracking-[1.1172px] text-[#99a1af] z-10 w-auto">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[16px] h-[58px] px-5 text-[16px] font-bold text-[#101828] placeholder-[rgba(16,24,40,0.5)] tracking-[-0.3125px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/20"
      />
    </div>
  );
}

function SelectInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="relative">
      <label className="absolute -top-1.5 left-4 bg-white px-1 text-[10px] font-black uppercase tracking-[1.1172px] text-[#99a1af] z-10 w-auto">
        {label}
      </label>
      <select
        className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[16px] h-[55px] px-5 text-[16px] font-bold text-[#101828] placeholder-[rgba(16,24,40,0.5)] tracking-[-0.3125px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/20 appearance-none"
      >
        <option value="" disabled selected hidden>{placeholder}</option>
        <option value="math">Mathematics</option>
        <option value="science">Physics</option>
        <option value="chem">Chemistry</option>
      </select>
    </div>
  );
}

function OptionInput({ value, checked = false }: { value: string; checked?: boolean }) {
  return (
    <div className={`flex items-center justify-between border ${checked ? 'border-[#00bc7d]' : 'border-[#f3f4f6]'} bg-white px-4 py-3 rounded-[12px] cursor-pointer`}>
      <span className={`text-[14px] font-bold ${checked ? 'text-[#00bc7d]' : 'text-[#6a7282]'}`}>{value}</span>
      {checked ? (
        <CheckCircle2 size={16} className="text-[#00bc7d] fill-[#d0fae5]" />
      ) : (
        <Circle size={16} className="text-[#e5e7eb] fill-[#f9fafb]" />
      )}
    </div>
  );
}
