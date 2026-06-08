import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRoomDashboard,
  getRooms,
  joinRoom,
  type RoomDashboard,
  type Room,
} from "@/api/room";
import {
  Search,
  Users,
  Clock,
  Plus,
  ClipboardList,
  Trophy,
  Lock,
} from "lucide-react";
import HostSessionModal from "@/components/HostSessionModal";
import HomeworkTab from "@/components/HomeworkTab";
import LeaderboardTab from "@/components/LeaderboardTab";

// ─── Subject styles ───────────────────────────────────────────────────────────

const SUBJECT_STYLES: Record<string, { border: string; label: string }> = {
  mathematics: { border: "border-t-blue-500", label: "text-blue-500" },
  maths: { border: "border-t-blue-500", label: "text-blue-500" },
  physics: { border: "border-t-violet-500", label: "text-violet-500" },
  chemistry: { border: "border-t-emerald-500", label: "text-emerald-500" },
  history: { border: "border-t-orange-400", label: "text-orange-400" },
  biology: { border: "border-t-pink-500", label: "text-pink-500" },
};

const DEFAULT_STYLE = { border: "border-t-gray-400", label: "text-gray-500" };

function subjectStyle(subject: string) {
  return SUBJECT_STYLES[subject.toLowerCase()] ?? DEFAULT_STYLE;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just started";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  color,
}: {
  value: number | null;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-5 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-0 px-2">
      <span className={`text-2xl sm:text-3xl font-black ${color}`}>
        {value ?? "—"}
      </span>
      <span className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const styles = subjectStyle(room.subject);
  const current = parseInt(room.learners, 10);
  const pct = Math.round((current / room.max_learners) * 100);
  const full = current >= room.max_learners;

  const handleJoin = async () => {
    setJoining(true);
    try {
      await joinRoom(room.id);
      navigate(`/study/${room.id}`, { state: { room } });
    } finally {
      setJoining(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm border-t-4 ${styles.border} flex flex-col overflow-hidden`}>
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Subject + private badge */}
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${styles.label}`}>
            {room.subject}
          </span>
          {room.is_private && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
              <Lock size={9} /> Private
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-black text-[#101828] leading-tight -mt-1">
          {room.topic}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
          <Clock size={11} />
          {timeAgo(room.created_at)}
        </div>

        {/* Learners + progress */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
              <Users size={12} />
              <span>
                {current}/{room.max_learners} Learners
              </span>
            </div>
            {full && (
              <span className="text-[9px] font-black uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                Full
              </span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${full ? "bg-red-400" : "bg-emerald-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Join button */}
      <div className="px-5 pb-5">
        <button
          disabled={full || joining}
          onClick={handleJoin}
          className="w-full flex items-center justify-center gap-2 bg-[#101828] hover:bg-[#1C398E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white text-[13px] font-black uppercase tracking-wider py-3 rounded-xl">
          <Users size={14} />
          {joining ? "Joining..." : full ? "Room Full" : "Join Session"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: "study-rooms", label: "Study Rooms", icon: Users },
  { id: "homework", label: "Homework", icon: ClipboardList },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Study() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("study-rooms");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [roomStats, setRoomStats] = useState<RoomDashboard | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getRoomDashboard()
      .then(setRoomStats)
      .catch(() => {});
    getRooms()
      .then(setRooms)
      .catch(() => {});
  }, []);

  const subjectFilters = [
    "ALL",
    ...Array.from(new Set(rooms.map((r) => r.subject))),
  ];

  const filtered = rooms.filter((r) => {
    const matchesSubject =
      subjectFilter === "ALL" || r.subject === subjectFilter;
    const matchesSearch =
      search === "" ||
      r.topic.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <HostSessionModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onRoomCreated={(room) =>
          navigate(`/study/${room.id}`, { state: { room } })
        }
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 w-full sm:w-fit mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-[12px] font-black uppercase tracking-wider transition-colors focus-visible:outline-none ${
                activeTab === id
                  ? "text-[#1C398E]"
                  : "text-gray-400 hover:text-gray-600"
              }`}>
              {activeTab === id && (
                <motion.div
                  layoutId="study-tab"
                  className="absolute inset-0 bg-blue-50 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10 shrink-0" />
              <span className="relative z-10 truncate">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "study-rooms" && (
            <motion.div
              key="study-rooms"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              {/* Section header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-[16px] font-black text-[#101828] tracking-tight">
                      STUDY ROOMS
                    </h1>
                    <p className="text-[12px] text-gray-400 font-medium">
                      Invite learners · Set goals · Study together
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHostModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-[#1C398E] hover:bg-[#162d72] text-white text-[12px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto">
                  <Plus size={14} />
                  Host a Session
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-8">
                <StatCard
                  value={roomStats?.activeRooms ?? null}
                  label="Active Rooms"
                  color="text-blue-600"
                />
                <StatCard
                  value={roomStats?.studentsOnline ?? null}
                  label="Students Online"
                  color="text-emerald-500"
                />
                <StatCard
                  value={roomStats?.subjectsActive ?? null}
                  label="Subjects Active"
                  color="text-orange-500"
                />
              </div>

              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <div className="relative flex-1 max-w-sm">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by topic or subject..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjectFilters.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubjectFilter(s)}
                      className={`px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors ${
                        subjectFilter === s
                          ? "bg-[#1C398E] text-white"
                          : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filtered.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && rooms.length > 0 && (
                  <p className="col-span-3 text-center text-gray-400 font-semibold py-16">
                    No study rooms found.
                  </p>
                )}
                {rooms.length === 0 && (
                  <p className="col-span-3 text-center text-gray-400 font-semibold py-16">
                    Loading rooms...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "homework" && (
            <motion.div
              key="homework"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <HomeworkTab />
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}>
              <LeaderboardTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
