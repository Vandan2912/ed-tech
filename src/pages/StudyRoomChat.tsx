import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Bot,
  User,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  PanelLeft,
  Plus,
  ChevronDown,
  X,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import {
  getRoomDetails,
  getRooms,
  type RoomDetails,
  type Room,
} from "@/api/room";
import { useAuth } from "@/auth/useAuth";
import HostSessionModal from "@/components/HostSessionModal";
import AiChatPaywall from "@/components/AiChatPaywall";

const SUGGESTIONS = [
  {
    emoji: "🔭",
    title: "Explore a Topic",
    description: "Deep dive into any subject",
    prompt: "Help me explore ",
  },
  {
    emoji: "📝",
    title: "Get a Quiz",
    description: "Test your knowledge",
    prompt: "Quiz me on ",
  },
  {
    emoji: "📄",
    title: "Summarize Docs",
    description: "Upload and summarize any document",
    prompt: "Summarize this: ",
  },
  {
    emoji: "🧮",
    title: "Solve Problems",
    description: "Step-by-step solutions",
    prompt: "Help me solve ",
  },
];

const PROMPT_CHIPS = [
  "What is quantum entanglement?",
  "Help me study for exams",
  "Explain photosynthesis",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const SOCKET_URL = "https://api.mastishq.ai";

interface AiMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export default function StudyRoomChat() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();

  const [details, setDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const [_socketConnected, setSocketConnected] = useState(false);
  const [_onlineCount, setOnlineCount] = useState(0);
  const [roomError, setRoomError] = useState<string | null>(null);

  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isPremium = !!user?.is_premium;
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(),
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;
    getRoomDetails(roomId)
      .then((data) => {
        setDetails(data);
        // Flatten date-keyed feed into a sorted message list
        const allItems = Object.values(data.feed).flat();
        if (allItems.length > 0) {
          const sorted = [...allItems].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          );
          setMessages(
            sorted.map((item) => ({
              id: `history-${item.id}`,
              question: item.prompt,
              answer: item.response,
              timestamp: new Date(item.created_at).getTime(),
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !user) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("join_room", { roomId, userId: user.id });
    });

    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("presence_update", (users: unknown) => {
      if (Array.isArray(users)) setOnlineCount(users.length);
      else if (typeof users === "object" && users !== null && "count" in users)
        setOnlineCount((users as { count: number }).count);
    });

    socket.on("room_error", (data: { message?: string }) => {
      setRoomError(data?.message ?? "You cannot join this room.");
    });

    socket.on(
      "new_host_chat",
      (data: {
        prompt?: string;
        response?: string;
        question?: string;
        answer?: string;
        message?: string;
        created_at?: string;
      }) => {
        setAiLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            question: data.prompt ?? data.question ?? data.message ?? "",
            answer: data.response ?? data.answer ?? "",
            timestamp: data.created_at
              ? new Date(data.created_at).getTime()
              : Date.now(),
          },
        ]);
      },
    );

    socket.on("ai_error", (data: { message?: string }) => {
      setAiLoading(false);
      setAiError(data?.message ?? "AI request failed.");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isPremium) return;
    getRooms()
      .then(setRooms)
      .catch(() => {});
  }, [isPremium]);

  useEffect(() => {
    if (!details) return;
    setExpandedSubjects((prev) => new Set(prev).add(details.room.subject));
  }, [details]);

  const roomsBySubject = useMemo(() => {
    return rooms.reduce<Record<string, Room[]>>((acc, room) => {
      (acc[room.subject] ||= []).push(room);
      return acc;
    }, {});
  }, [rooms]);

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
  };

  const handleNewChat = () => {
    if (isPremium) setHostModalOpen(true);
    else setShowPaywall(true);
  };

  const handleSend = () => {
    if (!input.trim() || !roomId || !user || aiLoading) return;
    setAiError(null);
    setAiLoading(true);
    socketRef.current?.emit("ask_ai", {
      roomId,
      userId: user.id,
      message: input.trim(),
    });
    setInput("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] flex items-center justify-center">
        <p className="text-gray-500 font-semibold text-[14px]">
          {"Connecting..."}
        </p>
      </main>
    );
  }

  if (!details || roomError) {
    return (
      <main className="min-h-screen bg-[#030712] flex items-center justify-center flex-col gap-4">
        <p className="text-red-400 font-bold text-[15px]">
          {roomError ?? "Room not found."}
        </p>
        <button
          onClick={() => navigate(`/study/${roomId}`)}
          className="px-5 py-2.5 bg-[#155dfc] text-white text-[12px] font-black uppercase tracking-wider rounded-xl">
          {"Back to Room"}
        </button>
      </main>
    );
  }

  const { host, session, user_role } = details;
  const isHost = user_role === "host";

  return (
    <div className="fixed inset-0 bg-[#030712] flex">
      {/* Sidebar — matches AiChatFullViewModal */}
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
                  {"Mastishq.ai"}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[rgba(89,22,139,0.4)] border border-[rgba(130,0,219,0.5)] rounded-[14px] px-3 py-2.5">
                <span className="w-2 h-2 rounded-full bg-[#c27aff] shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#dab2ff] leading-[1.4]">
                  {"Viewing"} {host.name}'s {"chats"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 hideScrollbar">
              <button
                onClick={handleNewChat}
                className="w-full h-11 rounded-xl bg-[#1e2e4e] hover:bg-[#24345a] flex items-center justify-center gap-2 text-white text-[13px] font-semibold transition-colors focus-visible:outline-none">
                <Plus size={16} />
                New Chat
              </button>

              {isPremium && Object.keys(roomsBySubject).length > 0 && (
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[1.07px] text-[#6a7282] px-2">
                    Student Rooms
                  </p>
                  {Object.entries(roomsBySubject).map(
                    ([subject, subjectRooms]) => {
                      const expanded = expandedSubjects.has(subject);
                      return (
                        <div
                          key={subject}
                          className="bg-[#1e2939] rounded-[14px] p-3 space-y-3">
                          <button
                            onClick={() => toggleSubject(subject)}
                            className="w-full flex items-center justify-between focus-visible:outline-none">
                            <span className="text-[12px] font-bold text-white">
                              {subject}
                            </span>
                            <ChevronDown
                              size={10}
                              className={`text-[#6a7282] transition-transform ${expanded ? "rotate-180" : ""}`}
                            />
                          </button>
                          {expanded && (
                            <div className="space-y-2.5">
                              {subjectRooms.slice(0, 3).map((room) => (
                                <button
                                  key={room.id}
                                  onClick={() =>
                                    navigate(`/study/${room.id}/chat`)
                                  }
                                  className="w-full flex items-center gap-2.5 pl-1 text-left focus-visible:outline-none">
                                  <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                      room.is_active
                                        ? "bg-[#00c950]"
                                        : "bg-[#4a5565]"
                                    }`}
                                  />
                                  <span className="flex-1 min-w-0 text-[11px] font-bold text-[#d1d5dc] truncate">
                                    {room.topic}
                                  </span>
                                </button>
                              ))}
                              {subjectRooms.length > 3 && (
                                <p className="text-[12px] font-semibold text-[#90a7d4] text-center pt-1">
                                  + {subjectRooms.length - 3} more
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}

              <div className="border-t border-[#3b5384]/40" />

              {/* Group messages by date like the modal */}
              {Object.keys(details.feed).map((dateKey) => (
                <div key={dateKey} className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#6a7282] px-2">
                    {dateKey}
                  </p>
                  {details.feed[dateKey].map((item, idx) => (
                    <button
                      key={item.id}
                      className={`w-full text-left rounded-[14px] border px-3 py-2.5 flex items-start gap-2 transition-colors ${
                        idx === 0
                          ? "bg-[rgba(21,93,252,0.2)] border-[rgba(21,93,252,0.4)]"
                          : "bg-transparent border-transparent hover:bg-[#1e2939]/40"
                      }`}>
                      <MessageSquare
                        size={14}
                        className={
                          idx === 0
                            ? "text-[#8ec5ff] mt-0.5 shrink-0"
                            : "text-[#6a7282] mt-0.5 shrink-0"
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[12px] font-bold truncate ${idx === 0 ? "text-[#8ec5ff]" : "text-[#d1d5dc]"}`}>
                          {item.prompt}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={10} className="text-[#6a7282]" />
                          <span className="text-[9px] text-[#6a7282]">
                            {new Date(item.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {showPaywall ? (
          <AiChatPaywall onClose={() => setShowPaywall(false)} />
        ) : (
          <>
            {/* Header — matches AiChatFullViewModal */}
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
                      {host.name}'s {"AI Chat"}
                    </p>
                    <p className="text-[9px] text-[#6a7282] tracking-wide">
                      {messages.length} {"messages"} · {session.time_ago}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/study/${roomId}`)}
                className="w-8 h-8 rounded-[10px] bg-[#1e2939] hover:bg-[#2a3441] flex items-center justify-center text-[#9ca3af] transition-colors focus-visible:outline-none">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              {messages.length === 0 && !aiLoading ? (
                isHost ? (
                  <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-4">
                    <div>
                      <h2 className="text-[32px] sm:text-[40px] font-bold text-white">
                        {getGreeting()}, {user?.first_name}! 👋
                      </h2>
                      <p className="mt-2 text-[16px] text-[#8c9ab5]">
                        What would you like to learn today?
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[720px] text-left">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s.title}
                          onClick={() => setInput(s.prompt)}
                          className="bg-[#101828] border border-[#1e2939] hover:border-[#364153] rounded-2xl p-5 transition-colors focus-visible:outline-none">
                          <div className="flex items-center gap-2">
                            <span className="text-[20px]">{s.emoji}</span>
                            <span className="text-[16px] font-bold text-white">
                              {s.title}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[14px] text-[#6a7282]">
                            {s.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[rgba(21,93,252,0.15)] flex items-center justify-center">
                      <Brain size={26} className="text-[#8ec5ff]" />
                    </div>
                    <p className="text-[14px] font-bold text-[#6a7282]">
                      Waiting for the host to start the AI chat…
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                      {/* User question */}
                      <div className="flex items-start gap-3 justify-end">
                        <div className="flex flex-col items-end gap-1 max-w-[70%]">
                          <div className="bg-[#155dfc] text-white rounded-2xl rounded-tr-lg px-5 py-3">
                            <p className="text-[14px] leading-relaxed">
                              {msg.question}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 pr-1">
                            <Clock size={10} className="text-[#4a5565]" />
                            <span className="text-[9px] text-[#4a5565]">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-[14px] bg-[#364153] flex items-center justify-center shrink-0">
                          <User size={16} className="text-[#9ca3af]" />
                        </div>
                      </div>

                      {/* AI answer */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[14px] bg-[rgba(21,93,252,0.2)] flex items-center justify-center shrink-0">
                          <Bot size={16} className="text-[#8ec5ff]" />
                        </div>
                        <div className="flex flex-col gap-1 max-w-[80%]">
                          <div className="bg-[#1e2939] border border-[#364153] rounded-2xl rounded-tl-lg px-5 py-4">
                            <p className="text-[14px] text-[#e5e7eb] leading-relaxed whitespace-pre-wrap">
                              {msg.answer}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 pl-1">
                            <Clock size={10} className="text-[#4a5565]" />
                            <span className="text-[9px] text-[#4a5565]">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-[14px] bg-[rgba(21,93,252,0.2)] flex items-center justify-center shrink-0">
                        <Bot size={16} className="text-[#8ec5ff]" />
                      </div>
                      <div className="bg-[#1e2939] border border-[#364153] rounded-2xl rounded-tl-lg px-5 py-4 flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#8ec5ff] animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#8ec5ff] animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#8ec5ff] animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  )}

                  {aiError && (
                    <p className="text-[12px] text-red-400 font-semibold text-center">
                      {aiError}
                    </p>
                  )}

                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Input — host only */}
            {isHost ? (
              <div className="bg-[#101828] border-t border-[#1e2939] px-5 py-4 shrink-0 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setInput(chip)}
                      className="px-4 py-2.5 rounded-full bg-[#1e2939] border border-[#364153] text-[13px] font-semibold text-[#d1d5dc] hover:border-[#4a5565] transition-colors focus-visible:outline-none">
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask the AI — everyone will see the answer…"
                    className="flex-1 bg-[#1e2939] border border-[#364153] text-[#e5e7eb] text-[14px] font-medium rounded-[14px] px-4 py-3 outline-none focus:border-[#155dfc] transition-colors placeholder:text-[#4a5565]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || aiLoading}
                    className="w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#155dfc] hover:bg-[#1249c7] disabled:opacity-40 transition-colors text-white shrink-0 focus-visible:outline-none">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#101828] border-t border-[#1e2939] h-12 flex items-center justify-center px-6 shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4a5565]">
                  Read-only view · only the host can ask the AI
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <HostSessionModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onRoomCreated={(room) => navigate(`/study/${room.id}/chat`)}
      />
    </div>
  );
}
