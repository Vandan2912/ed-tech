import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Trophy, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Trend = "up" | "down" | "stable";
type Period = "all" | "week" | "month";

interface Student {
  rank: number;
  name: string;
  subject: string;
  level: number;
  pts: number;
  xp: number;
  trend: Trend;
  isYou?: boolean;
  avatar: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { rank: 1, name: "Arjun Mehta", subject: "Physics", level: 24, pts: 2450, xp: 434, trend: "up", avatar: "AM" },
  { rank: 2, name: "Sara Khan", subject: "Mathematics", level: 22, pts: 2320, xp: 398, trend: "down", avatar: "SK" },
  { rank: 3, name: "Leo Das", subject: "Chemistry", level: 21, pts: 2210, xp: 312, trend: "stable", avatar: "LD" },
  { rank: 4, name: "Priya Sharma", subject: "Biology", level: 19, pts: 1940, xp: 281, trend: "up", avatar: "PS" },
  { rank: 5, name: "You", subject: "Mathematics", level: 18, pts: 1850, xp: 247, trend: "up", isYou: true, avatar: "YO" },
  { rank: 6, name: "Rohan Gupta", subject: "Physics", level: 17, pts: 1720, xp: 220, trend: "down", avatar: "RG" },
  { rank: 7, name: "Zoya Ali", subject: "Biology", level: 16, pts: 1650, xp: 198, trend: "up", avatar: "ZA" },
  { rank: 8, name: "Kiran Nair", subject: "Chemistry", level: 15, pts: 1580, xp: 176, trend: "stable", avatar: "KN" },
  { rank: 9, name: "Anjali Singh", subject: "History", level: 14, pts: 1430, xp: 154, trend: "up", avatar: "AS" },
  { rank: 10, name: "Dev Kapoor", subject: "Geography", level: 13, pts: 1280, xp: 132, trend: "down", avatar: "DK" },
];

const WEEK_STUDENTS: Student[] = STUDENTS.map((s) => ({
  ...s,
  pts: Math.round(s.pts * 0.12),
  xp: Math.round(s.xp * 0.15),
}));

const MONTH_STUDENTS: Student[] = STUDENTS.map((s) => ({
  ...s,
  pts: Math.round(s.pts * 0.45),
  xp: Math.round(s.xp * 0.5),
}));

const DATA_BY_PERIOD: Record<Period, Student[]> = {
  all: STUDENTS,
  week: WEEK_STUDENTS,
  month: MONTH_STUDENTS,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up")
    return <TrendingUp size={12} className="text-emerald-500 shrink-0" />;
  if (trend === "down")
    return <TrendingDown size={12} className="text-red-400 shrink-0" />;
  return <Minus size={12} className="text-gray-400 shrink-0" />;
}

// function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
//   const sizeClass = size === "lg" ? "w-14 h-14 text-[14px]" : size === "md" ? "w-10 h-10 text-[12px]" : "w-8 h-8 text-[11px]";
//   return (
//     <div className={cn("rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-600 shrink-0 border-2 border-white", sizeClass)}>
//       {initials}
//     </div>
//   );
// }

function PodiumCard({
  student,
  place,
}: {
  student: Student;
  place: 1 | 2 | 3;
}) {
  const config = {
    1: {
      height: "h-28",
      bg: "bg-amber-400",
      ring: "ring-4 ring-amber-300",
      avatarSize: "w-16 h-16 text-[15px]" as const,
      crown: true,
      label: "#1",
      labelBg: "bg-amber-400 text-white",
      order: "order-2",
      marginTop: "mt-0",
    },
    2: {
      height: "h-20",
      bg: "bg-gray-300",
      ring: "ring-4 ring-gray-200",
      avatarSize: "w-13 h-13 text-[13px]" as const,
      crown: false,
      label: "#2",
      labelBg: "bg-gray-400 text-white",
      order: "order-1",
      marginTop: "mt-8",
    },
    3: {
      height: "h-16",
      bg: "bg-orange-400",
      ring: "ring-4 ring-orange-200",
      avatarSize: "w-12 h-12 text-[13px]" as const,
      crown: false,
      label: "#3",
      labelBg: "bg-orange-400 text-white",
      order: "order-3",
      marginTop: "mt-12",
    },
  }[place];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: place * 0.08 }}
      className={cn("flex flex-col items-center gap-1", config.order, config.marginTop)}
    >
      {/* Crown for 1st */}
      {config.crown && (
        <Trophy size={20} className="text-amber-400 mb-0.5" />
      )}

      {/* Avatar */}
      <div className={cn("rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-600 border-4 border-white shadow-md", config.avatarSize, config.ring, place === 1 ? "w-16 h-16 text-[15px]" : place === 2 ? "w-12 h-12 text-[13px]" : "w-11 h-11 text-[12px]")}>
        {student.avatar}
      </div>

      {/* Name + pts */}
      <p className="text-[12px] font-black text-[#101828] mt-1">{student.name}</p>
      <p className="text-[11px] text-gray-500 font-semibold">{student.pts.toLocaleString()} pts</p>

      {/* Place block */}
      <div className={cn("w-full flex items-end justify-center rounded-t-xl pt-2 pb-1 mt-1 min-w-[80px]", config.height, config.bg)}>
        <span className="text-white text-[13px] font-black">{config.label}</span>
      </div>
    </motion.div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Trophy size={14} className="text-amber-500" /></div>;
  if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Trophy size={14} className="text-gray-400" /></div>;
  if (rank === 3) return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center"><Trophy size={14} className="text-orange-400" /></div>;
  return (
    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
      <span className="text-[12px] font-black text-gray-500">#{rank}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaderboardTab() {
  const [period, setPeriod] = useState<Period>("all");
  const students = DATA_BY_PERIOD[period];
  const top3 = students.slice(0, 3);
  // const rest = students.slice(3);
  const you = students.find((s) => s.isYou)!;

  const PERIODS: { id: Period; label: string }[] = [
    { id: "all", label: "All Time" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Trophy size={20} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-[16px] font-black text-[#101828] tracking-tight">Class Leaderboard</h2>
            <p className="text-[12px] text-gray-400 font-medium">Grade 10-A · 10 students</p>
          </div>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 self-start sm:self-auto">
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={cn(
                "px-2.5 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all",
                period === id
                  ? "bg-white text-[#101828] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Your rank banner ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Star size={16} className="text-blue-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Your Rank</p>
            <p className="text-[12px] sm:text-[13px] font-black text-[#1C398E] truncate">
              #{you.rank} of {students.length} students ·{" "}
              <span className="text-blue-600">{you.pts.toLocaleString()} pts</span>
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 sm:px-2.5 py-1 rounded-full shrink-0">
          <TrendingUp size={11} /> Rising
        </span>
      </div>

      {/* ── Podium ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center mb-6">
          Top 3 Classmates
        </p>
        <div className="flex items-end justify-center gap-3 sm:gap-6">
          <PodiumCard student={top3[1]} place={2} />
          <PodiumCard student={top3[0]} place={1} />
          <PodiumCard student={top3[2]} place={3} />
        </div>
      </div>

      {/* ── Full leaderboard table ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_90px] px-4 sm:px-5 py-3 border-b border-gray-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rank</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Student</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:block text-center">Level</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Points</span>
        </div>

        {/* All rows */}
        {students.map((student, i) => (
          <motion.div
            key={student.rank}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_90px] items-center px-4 sm:px-5 py-3.5 border-b border-gray-50 last:border-0 transition-colors",
              student.isYou ? "bg-blue-50/60" : "hover:bg-gray-50"
            )}
          >
            {/* Rank */}
            <div className="flex items-center">
              <RankBadge rank={student.rank} />
            </div>

            {/* Student info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200 flex items-center justify-center text-[10px] sm:text-[11px] font-black text-gray-600">
                  {student.avatar}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className={cn("text-[12px] sm:text-[13px] font-black truncate", student.isYou ? "text-[#1C398E]" : "text-[#101828]")}>
                    {student.name}
                  </span>
                  {student.isYou && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded-full shrink-0">
                      You
                    </span>
                  )}
                  <TrendIcon trend={student.trend} />
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate">{student.subject}</p>
              </div>
            </div>

            {/* Level — hidden on mobile */}
            <div className="hidden sm:flex items-center justify-center gap-1">
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">LV. {student.level}</span>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className={cn("text-[13px] sm:text-[14px] font-black", student.isYou ? "text-[#1C398E]" : "text-[#101828]")}>
                {student.pts.toLocaleString()}
              </p>
              <p className="text-[10px] text-amber-500 font-black flex items-center justify-end gap-0.5">
                <Zap size={9} />
                {student.xp} XP
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
