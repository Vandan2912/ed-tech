import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/auth/useAuth";
import { Pin, Video, Mic, FileText, Upload, Send } from "lucide-react";

export default function PinMessage() {
  const { user } = useAuth();
  const [mediaTab, setMediaTab] = useState<"video" | "audio" | "text">("video");

  const tabs = [
    { id: "video", label: "Video", icon: Video },
    { id: "audio", label: "Audio", icon: Mic },
    { id: "text", label: "Text", icon: FileText },
  ] as const;

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen">
      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#4f39f6] to-[#1447e6] rounded-[32px] p-8 md:p-10 relative overflow-hidden text-white">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">
                Welcome back, {user?.first_name || "Teacher"}!
              </h1>
              <p className="text-blue-100 text-base">
                Pin a video, audio, or text message for all your connected students.
              </p>
            </div>
          </div>
        </div>

        {/* Empty State Banner */}
        <div className="bg-[#f9fafb] border-2 border-[#e5e7eb] border-dashed rounded-[28px] py-8 flex flex-col items-center justify-center text-center">
          <Pin size={32} className="text-[#d1d5db] mb-4" />
          <h3 className="text-[#99a1af] text-[14px] font-bold tracking-[-0.1504px] mb-1">
            No message currently pinned
          </h3>
          <p className="text-[#99a1af] text-[12px]">
            Pin a video, audio, or text message for all students to see
          </p>
        </div>

        {/* Create Pinned Message Card */}
        <div className="bg-white border border-[#f3f4f6] shadow-sm rounded-[28px] p-6">
          <div className="mb-5">
            <h2 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.5496px]">
              Create Pinned Message
            </h2>
            <p className="text-[#6a7282] text-[12px]">
              Visible to all students connected to your class
            </p>
          </div>

          {/* Media Tabs */}
          <div className="flex bg-white gap-2 mb-6">
            {tabs.map((tab) => {
              const isActive = mediaTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMediaTab(tab.id as any)}
                  className={`relative flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl transition-colors ${
                    isActive
                      ? "text-white"
                      : "bg-[#f3f4f6] text-[#6a7282] hover:bg-[#e5e7eb]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="media-tab"
                      className="absolute inset-0 bg-[#4f39f6] rounded-2xl shadow-[0_10px_15px_0_#c6d2ff,0_4px_6px_0_#c6d2ff]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    <span className="text-[14px] font-black uppercase tracking-[1.2496px]">
                      {tab.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                Message Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Important: Revision for Unit 3 Test"
                className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                Short Description *
              </label>
              <textarea
                placeholder="Briefly describe what this message is about..."
                rows={3}
                className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold resize-none"
              />
            </div>

            {/* Conditional Media Inputs */}
            <div className="relative min-h-[140px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="popLayout" initial={false}>
                {mediaTab === "video" && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                        Video URL (YouTube, Drive...)
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                          <Video size={16} className="text-[#99a1af]" />
                        </div>
                        <input
                          type="text"
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-[#e5e7eb] border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload size={24} className="text-[#6a7282] mb-3" />
                      <p className="text-[#6a7282] text-[12px] font-bold mb-1">
                        Or upload a video file
                      </p>
                      <p className="text-[#99a1af] text-[10px] tracking-[0.1172px]">
                        MP4, MOV (max 500MB)
                      </p>
                    </div>
                  </motion.div>
                )}

                {mediaTab === "audio" && (
                  <motion.div
                    key="audio"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                        Audio URL (SoundCloud, Drive...)
                      </label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                          <Mic size={16} className="text-[#99a1af]" />
                        </div>
                        <input
                          type="text"
                          placeholder="https://soundcloud.com/..."
                          className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-[#e5e7eb] border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload size={24} className="text-[#6a7282] mb-3" />
                      <p className="text-[#6a7282] text-[12px] font-bold mb-1">
                        Or upload an audio file
                      </p>
                      <p className="text-[#99a1af] text-[10px] tracking-[0.1172px]">
                        MP3, WAV (max 50MB)
                      </p>
                    </div>
                  </motion.div>
                )}

                {mediaTab === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                        Detailed Message *
                      </label>
                      <textarea
                        placeholder="Write your full message here..."
                        rows={6}
                        className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#4f39f6] text-white h-[52px] rounded-2xl font-black text-[14px] uppercase tracking-[1.2496px] shadow-[0_20px_25px_0_#c6d2ff,0_8px_10px_0_#c6d2ff] flex items-center justify-center gap-2 hover:bg-[#3d24e5] transition-colors focus:outline-none active:scale-[0.98]">
              <Pin size={16} fill="white" />
              Pin for All Students
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-[28px] p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Send size={16} className="text-[#1c398e]" />
            <h4 className="text-[#1c398e] text-[14px] font-black uppercase tracking-[0.5496px]">
              How Pinned Messages Work
            </h4>
          </div>
          <ul className="space-y-2.5">
            {[
              "Pinned messages appear as a banner at the top of every student's dashboard",
              "Students can dismiss the message but it remains accessible",
              "Only one message can be pinned at a time — pinning a new one replaces the old",
              "Video messages show an embedded player; audio shows a compact audio bar",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="bg-[#2b7fff] w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" />
                <span className="text-[#1447e6] text-[12px]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
