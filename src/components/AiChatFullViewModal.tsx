import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowLeft,
  MessageSquare,
  Clock,
  Sparkles,
  Share2,
  User,
  PanelLeft,
  Bot,
} from "lucide-react";

interface ChatHistoryItem {
  id: number;
  title: string;
  time: string;
  group: string;
  active?: boolean;
}

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: React.ReactNode;
  time: string;
}

interface AiChatFullViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: string;
  avatar: string;
  topic: string;
  summary: string;
  timeAgo: string;
}

const HISTORY: ChatHistoryItem[] = [
  {
    id: 1,
    title: "Newton's Third Law states: **For e",
    time: "01:03",
    group: "Today",
    active: true,
  },
  {
    id: 2,
    title: "Newton's Laws of Motion",
    time: "22:58",
    group: "Yesterday",
  },
  {
    id: 3,
    title: "Algebra Problem Solving",
    time: "22:58",
    group: "2 days ago",
  },
  {
    id: 4,
    title: "Photosynthesis Explained",
    time: "21:58",
    group: "3 days ago",
  },
];

const MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: "user",
    content: "Explain Newton's 3rd Law with examples",
    time: "00:53",
  },
  {
    id: 2,
    role: "ai",
    content: (
      <>
        <p className="leading-relaxed text-[14px] text-[#e5e7eb]">
          Newton's Third Law states:{" "}
          <span className="font-black">
            For every action, there is an equal and opposite reaction.
          </span>
        </p>
        <p className="mt-3 leading-relaxed text-[14px] text-[#e5e7eb]">
          Key points:
        </p>
        <ul className="mt-1 space-y-1 text-[14px] text-[#e5e7eb] leading-relaxed">
          <li>- Forces always come in pairs</li>
          <li>- The paired forces act on different objects</li>
          <li>- They are equal in magnitude, opposite in direction</li>
        </ul>
      </>
    ),
    time: "00:54",
  },
];

export default function AiChatFullViewModal({
  isOpen,
  onClose,
  author,
  avatar,
  topic,
  summary,
  timeAgo,
}: AiChatFullViewModalProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const grouped = HISTORY.reduce<Record<string, ChatHistoryItem[]>>(
    (acc, item) => {
      (acc[item.group] ||= []).push(item);
      return acc;
    },
    {},
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 bg-[#030712] flex">
            {/* Sidebar */}
            <AnimatePresence initial={false}>
              {sidebarOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#101828] border-r border-[#1e2939] flex flex-col shrink-0 overflow-hidden">
                  <div className="border-b border-[#1e2939] p-4 flex flex-col gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-[14px] bg-[#155dfc] flex items-center justify-center">
                        <Bot size={16} className="text-white" />
                      </div>
                      <p className="text-[14px] font-black text-white tracking-tight">
                        Mastishq.ai
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[rgba(89,22,139,0.4)] border border-[rgba(130,0,219,0.5)] rounded-[14px] px-3 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#c27aff] shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#dab2ff] leading-[1.4]">
                        Viewing {author}'s chats
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-4 hideScrollbar">
                    {Object.entries(grouped).map(([group, items]) => (
                      <div key={group} className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6a7282] px-2">
                          {group}
                        </p>
                        {items.map((item) => (
                          <button
                            key={item.id}
                            className={`w-full text-left rounded-[14px] border px-3 py-2.5 flex items-start gap-2 transition-colors ${
                              item.active
                                ? "bg-[rgba(21,93,252,0.2)] border-[rgba(21,93,252,0.4)]"
                                : "bg-transparent border-transparent hover:bg-[#1e2939]/40"
                            }`}>
                            <MessageSquare
                              size={14}
                              className={
                                item.active
                                  ? "text-[#8ec5ff] mt-0.5 shrink-0"
                                  : "text-[#6a7282] mt-0.5 shrink-0"
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-[12px] font-bold truncate ${
                                  item.active
                                    ? "text-[#8ec5ff]"
                                    : "text-[#d1d5dc]"
                                }`}>
                                {item.title}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-[#6a7282]" />
                                <span className="text-[9px] text-[#6a7282]">
                                  {item.time}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Main chat */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="bg-[#101828] border-b border-[#1e2939] h-[61px] flex items-center justify-between px-5 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[#9ca3af] hover:bg-[#1e2939] transition-colors focus-visible:outline-none">
                    {sidebarOpen ? (
                      <ArrowLeft size={16} />
                    ) : (
                      <PanelLeft size={16} />
                    )}
                  </button>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-[10px] bg-[rgba(21,93,252,0.2)] flex items-center justify-center shrink-0">
                      <Sparkles size={14} className="text-[#8ec5ff]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-black text-white tracking-tight truncate">
                        {author}'s AI Chat
                      </p>
                      <p className="text-[9px] text-[#6a7282] tracking-wide">
                        {MESSAGES.length} messages · {timeAgo}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-[10px] bg-[#1e2939] hover:bg-[#2a3441] flex items-center justify-center text-[#9ca3af] transition-colors focus-visible:outline-none">
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-10 hideScrollbar">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1 h-px bg-[#1e2939]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#4a5565]">
                    {timeAgo}
                  </span>
                  <div className="flex-1 h-px bg-[#1e2939]" />
                </div>

                {/* Topic banner */}
                <div className="mb-8 w-full">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8ec5ff] mb-1">
                    {topic}
                  </p>
                  <p className="text-[13px] text-[#9ca3af] font-medium leading-relaxed">
                    {summary}
                  </p>
                </div>

                <div className="w-full space-y-6">
                  {MESSAGES.map((m) =>
                    m.role === "user" ? (
                      <div
                        key={m.id}
                        className="flex items-start gap-3 justify-end">
                        <div className="flex flex-col items-end gap-1 max-w-[70%]">
                          <div className="bg-[#155dfc] text-white rounded-2xl rounded-tr-lg px-5 py-3">
                            <p className="text-[14px] leading-relaxed">
                              {m.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 pr-1">
                            <Clock size={10} className="text-[#4a5565]" />
                            <span className="text-[9px] text-[#4a5565]">
                              {m.time}
                            </span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-[14px] bg-[#364153] flex items-center justify-center shrink-0">
                          <User size={16} className="text-[#9ca3af]" />
                        </div>
                      </div>
                    ) : (
                      <div key={m.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[14px] bg-[rgba(21,93,252,0.2)] flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-[#8ec5ff]" />
                        </div>
                        <div className="flex flex-col gap-1 max-w-[80%]">
                          <div className="bg-[#1e2939] border border-[#364153] rounded-2xl rounded-tl-lg px-5 py-4">
                            {m.content}
                          </div>
                          <div className="flex items-center gap-1 pl-1">
                            <Clock size={10} className="text-[#4a5565]" />
                            <span className="text-[9px] text-[#4a5565]">
                              {m.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#101828] border-t border-[#1e2939] h-12 flex items-center justify-center px-6 shrink-0">
                <div className="flex items-center gap-2">
                  <Share2 size={11} className="text-[#4a5565]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4a5565]">
                    Read-only view · {author}'s AI chat session
                  </p>
                </div>
              </div>

              {/* Hidden avatar reference to satisfy prop usage */}
              <span className="sr-only">{avatar}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
