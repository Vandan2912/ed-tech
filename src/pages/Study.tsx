import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Video,
  FileText,
  Users,
  Clock,
  Target,
  Plus,
  BookOpen,
  ClipboardList,
  Trophy,
} from "lucide-react";
import HostSessionModal from "@/components/HostSessionModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "VIDEO" | "TEXT";
type Subject = "Mathematics" | "Physics" | "Chemistry" | "History" | "Biology";

interface StudyRoom {
  id: number;
  subject: Subject;
  contentType: ContentType;
  title: string;
  host: {
    name: string;
    avatar: string;
    level: number;
    xp: number;
  };
  timeAgo: string;
  goals: string[];
  tags: string[];
  grade: string;
  learners: { current: number; max: number };
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const SUBJECT_STYLES: Record<Subject, { border: string; label: string }> = {
  Mathematics: { border: "border-t-blue-500", label: "text-blue-500" },
  Physics: { border: "border-t-violet-500", label: "text-violet-500" },
  Chemistry: { border: "border-t-emerald-500", label: "text-emerald-500" },
  History: { border: "border-t-orange-400", label: "text-orange-400" },
  Biology: { border: "border-t-pink-500", label: "text-pink-500" },
};

const ROOMS: StudyRoom[] = [
  {
    id: 1,
    subject: "Mathematics",
    contentType: "VIDEO",
    title: "Algebra Basics",
    host: { name: "Arjun Mehta", avatar: "AM", level: 24, xp: 434 },
    timeAgo: "13 min ago",
    goals: [
      "Solve 5 quadratic equations together",
      "Review the quadratic formula",
    ],
    tags: ["Equations", "Variables", "Grade 10"],
    grade: "Grade 10",
    learners: { current: 3, max: 5 },
  },
  {
    id: 2,
    subject: "Physics",
    contentType: "TEXT",
    title: "Laws of Motion",
    host: { name: "Sara Khan", avatar: "SK", level: 22, xp: 356 },
    timeAgo: "8 min ago",
    goals: [
      "Cover all 3 Newton's Laws",
      "Solve 5 force problems",
    ],
    tags: ["Newton", "Inertia", "Grade 8"],
    grade: "Grade 8",
    learners: { current: 2, max: 4 },
  },
  {
    id: 3,
    subject: "Chemistry",
    contentType: "VIDEO",
    title: "Organic Chemistry",
    host: { name: "Leo Das", avatar: "LD", level: 21, xp: 168 },
    timeAgo: "Just started",
    goals: [
      "Memorise functional groups",
      "Draw structural formulas",
    ],
    tags: ["Carbon", "Functional Groups", "Grade 11"],
    grade: "Grade 11",
    learners: { current: 1, max: 3 },
  },
  {
    id: 4,
    subject: "History",
    contentType: "TEXT",
    title: "French Revolution",
    host: { name: "Priya Sharma", avatar: "PS", level: 19, xp: 192 },
    timeAgo: "23 min ago",
    goals: [
      "List key causes of the Revolution",
      "Discuss the role of Enlightenment",
    ],
    tags: ["Causes", "Impact", "Grade 10"],
    grade: "Grade 10",
    learners: { current: 4, max: 6 },
  },
  {
    id: 5,
    subject: "Biology",
    contentType: "VIDEO",
    title: "Genetics",
    host: { name: "Zoya Ali", avatar: "ZA", level: 21, xp: 314 },
    timeAgo: "1 hour ago",
    goals: [
      "Understand Mendel's laws",
      "Solve a Punnett square together",
    ],
    tags: ["DNA", "Heredity", "Grade 12"],
    grade: "Grade 12",
    learners: { current: 2, max: 4 },
  },
];

const SUBJECT_FILTERS: (Subject | "ALL")[] = [
  "ALL",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography" as any,
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-5 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-0">
      <span className={`text-3xl font-black ${color}`}>{value}</span>
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function ContentBadge({ type }: { type: ContentType }) {
  if (type === "VIDEO") {
    return (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
        <Video size={10} /> Video
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
      <FileText size={10} /> Text
    </span>
  );
}

function RoomCard({ room }: { room: StudyRoom }) {
  const navigate = useNavigate();
  const styles = SUBJECT_STYLES[room.subject];
  const pct = Math.round((room.learners.current / room.learners.max) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm border-t-4 ${styles.border} flex flex-col overflow-hidden`}
    >
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Subject + content type */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-black uppercase tracking-widest ${styles.label}`}>
            {room.subject}
          </span>
          <ContentBadge type={room.contentType} />
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-black text-[#101828] leading-tight -mt-1">{room.title}</h3>

        {/* Host row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-600 shrink-0">
              {room.host.avatar}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[12px] font-bold text-[#101828]">{room.host.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-black text-gray-400 uppercase">LVL {room.host.level}</span>
                <span className="text-[10px] font-black text-amber-500">⚡{room.host.xp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
            <Clock size={11} />
            {room.timeAgo}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Target size={12} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Goals</span>
          </div>
          <ul className="space-y-1">
            {room.goals.map((g, i) => (
              <li key={i} className="text-[12px] text-emerald-800 font-medium flex gap-1.5">
                <span className="mt-0.5 text-emerald-500">•</span>
                {g}
              </li>
            ))}
            <li className="text-[11px] text-emerald-500 font-semibold">+1 more goal</li>
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {room.tags.map((tag) => (
            <span key={tag} className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Learners + progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Users size={12} />
            <span>{room.learners.current}/{room.learners.max} Learners</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Join button */}
      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(`/study/${room.id}`, { state: { room } })}
          className="w-full flex items-center justify-center gap-2 bg-[#101828] hover:bg-[#1C398E] transition-colors text-white text-[13px] font-black uppercase tracking-wider py-3 rounded-xl"
        >
          <Users size={14} />
          Join Session
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
  const [activeTab, setActiveTab] = useState<TabId>("study-rooms");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<Subject | "ALL">("ALL");
  const [hostModalOpen, setHostModalOpen] = useState(false);

  const filtered = ROOMS.filter((r) => {
    const matchesSubject = subjectFilter === "ALL" || r.subject === subjectFilter;
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <HostSessionModal isOpen={hostModalOpen} onClose={() => setHostModalOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 w-fit mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-colors focus-visible:outline-none ${
                activeTab === id
                  ? "text-[#1C398E]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === id && (
                <motion.div
                  layoutId="study-tab"
                  className="absolute inset-0 bg-blue-50 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{label}</span>
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
              transition={{ duration: 0.18 }}
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-[16px] font-black text-[#101828] tracking-tight">STUDY ROOMS</h1>
                    <p className="text-[12px] text-gray-400 font-medium">Invite learners · Set goals · Study together</p>
                  </div>
                </div>
                <button
                  onClick={() => setHostModalOpen(true)}
                  className="flex items-center gap-2 bg-[#1C398E] hover:bg-[#162d72] text-white text-[12px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={14} />
                  Host a Session
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-8">
                <StatCard value={5} label="Active Rooms" color="text-blue-600" />
                <StatCard value={12} label="Students Online" color="text-emerald-500" />
                <StatCard value={5} label="Subjects Active" color="text-orange-500" />
              </div>

              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <div className="relative flex-1 max-w-sm">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by topic or subject..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_FILTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubjectFilter(s as any)}
                      className={`px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors ${
                        subjectFilter === s
                          ? "bg-[#1C398E] text-white"
                          : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
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
                {filtered.length === 0 && (
                  <p className="col-span-3 text-center text-gray-400 font-semibold py-16">
                    No study rooms found.
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
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400"
            >
              <BookOpen size={40} className="text-gray-300" />
              <p className="text-[15px] font-bold">Homework coming soon</p>
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400"
            >
              <Trophy size={40} className="text-gray-300" />
              <p className="text-[15px] font-bold">Leaderboard coming soon</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
