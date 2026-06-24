import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { Users, Clock, Target, LogOut, Brain, UserPlus } from "lucide-react";
import { leaveRoom, getRoomDetails, type RoomDetails } from "@/api/room";
import InviteLearnersModal from "@/components/InviteLearnersModal";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LeaveRoomPanel({ onConfirm }: { onConfirm: () => void }) {
  const t = useTranslation();
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3 h-full">
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <LogOut size={18} className="text-red-500" />
      </div>
      <div>
        <p className="text-[14px] font-black text-red-600 uppercase tracking-wider">
          {t.studyRoom.leaveRoom}
        </p>
        <p className="text-[12px] text-red-400 font-medium mt-0.5">
          {t.studyRoom.progressSaved}
        </p>
      </div>
      <button
        onClick={onConfirm}
        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-[12px] font-black uppercase tracking-widest rounded-xl transition-colors focus-visible:outline-none">
        {t.studyRoom.confirmLeave}
      </button>
    </div>
  );
}

export default function StudyRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const t = useTranslation();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [details, setDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLeft = useRef(false);

  useEffect(() => {
    if (!roomId) return;
    getRoomDetails(roomId)
      .then(setDetails)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  // useEffect(() => {
  //   return () => {
  //     if (roomId && !hasLeft.current) {
  //       hasLeft.current = true;
  //       leaveRoom(Number(roomId)).catch(() => {});
  //     }
  //   };
  // }, [roomId]);

  const handleLeave = async () => {
    if (roomId && !hasLeft.current) {
      hasLeft.current = true;
      try {
        await leaveRoom(Number(roomId));
      } catch {
        // navigate away regardless
      }
    }
    navigate("/study");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-gray-400 font-semibold text-[14px]">
          {t.studyRoom.loading}
        </p>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-gray-400 font-semibold text-[14px]">
          {t.studyRoom.notFound}
        </p>
      </main>
    );
  }

  const { room, host, learners, participants, session, goals, user_role } =
    details;
  const isHost = user_role === "host";

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <InviteLearnersModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        roomId={roomId!}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-5">
        {/* Hero + Leave row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-linear-to-br from-[#1C398E] via-[#2250C4] to-[#3B5FD4] rounded-3xl px-8 py-8 text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-5">
                {session.is_live ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t.studyRoom.liveSession}
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 text-white/60 px-3 py-1 rounded-full">
                    {t.studyRoom.ended}
                  </span>
                )}
              </div>

              <p className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">
                {room.subject}
              </p>
              <h1 className="text-[36px] font-black leading-none tracking-tight mb-2">
                {room.topic}
              </h1>
              <p className="text-[13px] text-white/60 font-medium mb-6">
                {t.studyRoom.hostedBy}{" "}
                <span className="text-white font-bold">{host.name}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 border border-white/15 text-white/80 px-3 py-1.5 rounded-full">
                  <Users size={12} />
                  {learners.current}/{learners.max} {t.study.learners}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white/10 border border-white/15 text-white/80 px-3 py-1.5 rounded-full">
                  <Clock size={12} />
                  {session.time_ago}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}>
            <LeaveRoomPanel onConfirm={handleLeave} />
          </motion.div>
        </div>

        {/* In Room + Session Goals row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-[12px] font-black uppercase tracking-widest text-gray-500">
                  {t.studyRoom.inRoom}
                </span>
              </div>
              <span className="text-[12px] font-black text-gray-400">
                {participants.length}/{learners.max}
              </span>
            </div>

            <div className="flex -space-x-2 mb-4">
              {participants.map((p) => (
                <div
                  key={p.user_id}
                  className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-600">
                  {initials(p.name)}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {participants.map((p) => (
                <div
                  key={p.user_id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0">
                    {initials(p.name)}
                  </div>
                  <span className="flex-1 text-[13px] font-bold text-[#101828]">
                    {p.name}
                  </span>
                  {p.is_host ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      {t.studyRoom.host}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      {t.studyRoom.joined}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-emerald-600" />
              <span className="text-[12px] font-black uppercase tracking-widest text-emerald-700">
                {t.studyRoom.sessionGoals}
              </span>
            </div>
            <p className="text-[11px] text-emerald-500 font-semibold mb-4">
              {goals.length} goal{goals.length !== 1 ? "s" : ""} set
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g, i) => (
                <div
                  key={g.id}
                  className="flex items-center gap-3 bg-white/70 border border-emerald-100 rounded-xl px-4 py-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[13px] font-semibold text-emerald-900 leading-snug">
                    {g.goal}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Shared AI Insights + Invite Learners row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col">
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
                    AI chats from host · visible to all members
                  </p>
                </div>
              </div>
              {session.is_live && (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>

            {isHost ? (
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/study/${roomId}/chat`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-black uppercase tracking-wider rounded-xl transition-colors focus-visible:outline-none">
                  <Brain size={14} />
                  Start AI Chat
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/study/${roomId}/chat`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-violet-50 hover:bg-violet-100 text-violet-700 text-[12px] font-black uppercase tracking-wider rounded-xl transition-colors border border-violet-200 focus-visible:outline-none">
                  <Brain size={14} />
                  View AI Insights
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-3 mb-4">
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
              className="flex items-center justify-center gap-1.5 w-full py-3 text-[12px] font-black uppercase tracking-wider text-white bg-[#1C398E] hover:bg-[#162d72] transition-colors rounded-xl focus-visible:outline-none">
              <UserPlus size={14} />+ Add Members
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
