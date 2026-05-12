import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Video,
  FileText,
  Users,
  Clock,
  Target,
  LogOut,
  Brain,
  Sparkles,
  UserPlus,
  Maximize2,
} from "lucide-react";
import { leaveRoom } from "@/api/room";
import InviteLearnersModal from "@/components/InviteLearnersModal";
import AiChatFullViewModal from "@/components/AiChatFullViewModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomMember {
  id: number;
  name: string;
  avatar: string;
  role: "host" | "joined";
}

interface AiInsight {
  id: number;
  author: string;
  avatar: string;
  isYou?: boolean;
  timeAgo: string;
  topic: string;
  summary: string;
}

// ─── Mock data (in a real app this would come from route state / API) ─────────

const MEMBERS: RoomMember[] = [
  { id: 1, name: "You", avatar: "YO", role: "host" },
  { id: 2, name: "You", avatar: "YO", role: "joined" },
];

const GOALS = ["fsdfs", "sfsf"];

const AI_INSIGHTS: AiInsight[] = [
  {
    id: 1,
    author: "Arjun Mehta",
    avatar: "AM",
    timeAgo: "5 min ago",
    topic: "Newton's 3rd Law",
    summary: "Explained action-reaction pairs with rocket examples...",
  },
  {
    id: 2,
    author: "You",
    avatar: "YO",
    isYou: true,
    timeAgo: "Just now",
    topic: "Algebra — Quadratics",
    summary: "Solved quadratic formula step by step...",
  },
];

// ─── Leave Room confirm panel ─────────────────────────────────────────────────

function LeaveRoomPanel({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3 h-full">
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <LogOut size={18} className="text-red-500" />
      </div>
      <div>
        <p className="text-[14px] font-black text-red-600 uppercase tracking-wider">
          Leave Room
        </p>
        <p className="text-[12px] text-red-400 font-medium mt-0.5">
          Your progress is saved
        </p>
      </div>
      <button
        onClick={onConfirm}
        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-black uppercase tracking-widest rounded-xl transition-colors focus-visible:outline-none"
      >
        Confirm Leave
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudyRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [openInsight, setOpenInsight] = useState<AiInsight | null>(null);

  // Room data passed via router state; fall back to demo data
  const room = (location.state as any)?.room ?? {
    subject: "Mathematics",
    contentType: "VIDEO",
    title: "Algebra Basics",
    host: { name: "You", avatar: "YO", level: 24, xp: 434 },
    learners: { current: 2, max: 4 },
  };

  const handleLeave = async () => {
    if (room.id) {
      try {
        await leaveRoom(room.id);
      } catch {
        // navigate away regardless
      }
    }
    navigate("/study");
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <InviteLearnersModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
      <AiChatFullViewModal
        isOpen={openInsight !== null}
        onClose={() => setOpenInsight(null)}
        author={openInsight?.author ?? ""}
        avatar={openInsight?.avatar ?? ""}
        topic={openInsight?.topic ?? ""}
        summary={openInsight?.summary ?? ""}
        timeAgo={openInsight?.timeAgo ?? ""}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-5">
        {/* Hero + Leave row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          {/* Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-linear-to-br from-[#1C398E] via-[#2250C4] to-[#3B5FD4] rounded-3xl px-8 py-8 text-white overflow-hidden"
          >
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badges row */}
              <div className="flex items-center justify-between mb-5">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Session
                </span>
                {room.contentType === "VIDEO" ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 text-white/80 px-2.5 py-1 rounded-full">
                    <Video size={10} /> Video
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 text-white/80 px-2.5 py-1 rounded-full">
                    <FileText size={10} /> Text
                  </span>
                )}
              </div>

              {/* Subject + title */}
              <p className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">
                {room.subject}
              </p>
              <h1 className="text-[36px] font-black leading-none tracking-tight mb-2">
                {room.title}
              </h1>
              <p className="text-[13px] text-white/60 font-medium mb-6">
                Hosted by <span className="text-white font-bold">You</span>
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 border border-white/15 text-white/80 px-3 py-1.5 rounded-full">
                  <Users size={12} />
                  {room.learners.current}/{room.learners.max} Learners
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 border border-white/15 text-white/80 px-3 py-1.5 rounded-full">
                  <Clock size={12} />
                  Just started
                </span>
              </div>
            </div>
          </motion.div>

          {/* Leave panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <LeaveRoomPanel onConfirm={handleLeave} />
          </motion.div>
        </div>

        {/* In Room + Session Goals row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* In Room */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-[12px] font-black uppercase tracking-widest text-gray-500">
                  In Room
                </span>
              </div>
              <span className="text-[12px] font-black text-gray-400">
                {MEMBERS.length}/{room.learners.max}
              </span>
            </div>

            {/* Avatar stack */}
            <div className="flex -space-x-2 mb-4">
              {MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-600"
                >
                  {m.avatar}
                </div>
              ))}
            </div>

            {/* Member list */}
            <div className="space-y-2">
              {MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0">
                    {m.avatar}
                  </div>
                  <span className="flex-1 text-[13px] font-bold text-[#101828]">
                    {m.name}
                  </span>
                  {m.role === "host" ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      Host
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Joined
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Session Goals */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-emerald-600" />
              <span className="text-[12px] font-black uppercase tracking-widest text-emerald-700">
                Session Goals
              </span>
            </div>
            <p className="text-[11px] text-emerald-500 font-semibold mb-4">
              {GOALS.length} goal{GOALS.length !== 1 ? "s" : ""} set
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((goal, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/70 border border-emerald-100 rounded-xl px-4 py-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[13px] font-semibold text-emerald-900 leading-snug">
                    {goal}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Shared AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Brain size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-700">
                  Shared AI Insights
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  AI chats from everyone · visible to all members
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {AI_INSIGHTS.map((insight) => (
              <div
                key={insight.id}
                className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0">
                    {insight.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-[#101828]">
                        {insight.author}
                      </span>
                      {insight.isYou && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {insight.timeAgo}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none">
                    <Sparkles size={14} />
                  </button>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                  {insight.topic}
                </p>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed mb-3">
                  {insight.summary}
                </p>
                <button
                  onClick={() => setOpenInsight(insight)}
                  className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-blue-600 transition-colors focus-visible:outline-none rounded-[14px] border border-[#F3F4F6] bg-[#F9FAFB] p-2 w-full"
                >
                  <Maximize2 size={11} /> See full chat
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Invite Learners */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <UserPlus size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#1C398E] uppercase tracking-wider">
                Invite Learners
              </p>
              <p className="text-[12px] text-blue-400 font-medium mt-0.5">
                Send invites to classmates and grow your study group
              </p>
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-none shrink-0 ml-4"
          >
            <UserPlus size={14} />+ Add Members
          </button>
        </motion.div>
      </div>
    </main>
  );
}
