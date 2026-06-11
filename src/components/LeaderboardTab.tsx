import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Trophy, Star, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getClassLeaderboard } from "@/api/ranks";
import type { ClassLeaderboardUser } from "@/api/ranks";

type Trend = "up" | "down" | "stable";

function getTrend(rankChange: string): Trend {
  if (rankChange === "-" || rankChange === "0") return "stable";
  const n = parseInt(rankChange, 10);
  if (isNaN(n)) return "stable";
  return n > 0 ? "up" : "down";
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp size={12} className="text-emerald-500 shrink-0" />;
  if (trend === "down") return <TrendingDown size={12} className="text-red-400 shrink-0" />;
  return <Minus size={12} className="text-gray-400 shrink-0" />;
}

function UserAvatar({ user, className }: { user: ClassLeaderboardUser; className?: string }) {
  const initials = ((user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")).toUpperCase();
  if (user.profile_image) {
    return <img src={user.profile_image} alt={user.name} className={cn("rounded-full object-cover", className)} />;
  }
  return (
    <div className={cn("rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-600", className)}>
      {initials}
    </div>
  );
}

function PodiumCard({ user, place }: { user: ClassLeaderboardUser; place: 1 | 2 | 3 }) {
  const config = {
    1: { height: "h-28", bg: "bg-amber-400", ring: "ring-4 ring-amber-300", size: "w-16 h-16 text-[15px]", crown: true, label: "#1", order: "order-2", marginTop: "mt-0" },
    2: { height: "h-20", bg: "bg-gray-300", ring: "ring-4 ring-gray-200", size: "w-12 h-12 text-[13px]", crown: false, label: "#2", order: "order-1", marginTop: "mt-8" },
    3: { height: "h-16", bg: "bg-orange-400", ring: "ring-4 ring-orange-200", size: "w-11 h-11 text-[12px]", crown: false, label: "#3", order: "order-3", marginTop: "mt-12" },
  }[place];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: place * 0.08 }}
      className={cn("flex flex-col items-center gap-1", config.order, config.marginTop)}
    >
      {config.crown && <Trophy size={20} className="text-amber-400 mb-0.5" />}
      <UserAvatar user={user} className={cn("border-4 border-white shadow-md", config.ring, config.size)} />
      <p className="text-[12px] font-black text-[#101828] mt-1 text-center max-w-[80px] truncate">{user.name}</p>
      <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-0.5">
        <Zap size={10} className="text-amber-500" />
        {user.xp} XP
      </p>
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

export default function LeaderboardTab() {
  const [myRank, setMyRank] = useState<ClassLeaderboardUser | null>(null);
  const [topThree, setTopThree] = useState<ClassLeaderboardUser[]>([]);
  const [allStudents, setAllStudents] = useState<ClassLeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClassLeaderboard()
      .then((res) => {
        const combined = [...res.top_three, ...res.leaderboard].sort((a, b) => a.rank - b.rank);
        setMyRank(res.my_rank);
        setTopThree(res.top_three);
        setAllStudents(combined);
      })
      .finally(() => setLoading(false));
  }, []);

  const trend = myRank ? getTrend(myRank.rank_change) : "stable";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <Trophy size={20} className="text-amber-500" />
        </div>
        <div>
          <h2 className="text-[16px] font-black text-[#101828] tracking-tight">Class Leaderboard</h2>
          <p className="text-[12px] text-gray-400 font-medium">
            {allStudents.length > 0 ? `${allStudents.length} students` : "Loading…"}
          </p>
        </div>
      </div>

      {/* Your Rank Banner */}
      {myRank && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Star size={16} className="text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Your Rank</p>
              <p className="text-[12px] sm:text-[13px] font-black text-[#1C398E]">
                #{myRank.rank} of {allStudents.length} students ·{" "}
                <span className="text-amber-500 inline-flex items-center gap-0.5">
                  <Zap size={11} />
                  {myRank.xp} XP
                </span>
              </p>
            </div>
          </div>
          <span className={cn(
            "flex items-center gap-1 text-[10px] sm:text-[11px] font-black px-2 sm:px-2.5 py-1 rounded-full shrink-0",
            trend === "up" ? "text-emerald-600 bg-emerald-50 border border-emerald-100" :
            trend === "down" ? "text-red-500 bg-red-50 border border-red-100" :
            "text-gray-500 bg-gray-50 border border-gray-100"
          )}>
            {trend === "up" ? <><TrendingUp size={11} /> Rising</> :
             trend === "down" ? <><TrendingDown size={11} /> Falling</> :
             <><Minus size={11} /> Steady</>}
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Podium */}
          {topThree.length >= 1 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center mb-6">
                Top 3 Classmates
              </p>
              <div className="flex items-end justify-center gap-3 sm:gap-6">
                {topThree[1] && <PodiumCard user={topThree[1]} place={2} />}
                {topThree[0] && <PodiumCard user={topThree[0]} place={1} />}
                {topThree[2] && <PodiumCard user={topThree[2]} place={3} />}
              </div>
            </div>
          )}

          {/* Full leaderboard table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_90px] px-4 sm:px-5 py-3 border-b border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rank</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Student</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:block text-center">Level</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">XP</span>
            </div>

            {allStudents.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-[13px] font-medium">No data available</div>
            )}

            {allStudents.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_90px] items-center px-4 sm:px-5 py-3.5 border-b border-gray-50 last:border-0 transition-colors",
                  user.is_current_user ? "bg-blue-50/60" : "hover:bg-gray-50"
                )}
              >
                {/* Rank */}
                <div className="flex items-center">
                  <RankBadge rank={user.rank} />
                </div>

                {/* Student */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <UserAvatar user={user} className="w-8 h-8 sm:w-9 sm:h-9 text-[10px] sm:text-[11px] shrink-0" />
                  <div className="min-w-0 flex items-center gap-1">
                    <span className={cn("text-[12px] sm:text-[13px] font-black truncate", user.is_current_user ? "text-[#1C398E]" : "text-[#101828]")}>
                      {user.name}
                    </span>
                    {user.is_current_user && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded-full shrink-0">
                        You
                      </span>
                    )}
                    <TrendIcon trend={getTrend(user.rank_change)} />
                  </div>
                </div>

                {/* Level */}
                <div className="hidden sm:flex items-center justify-center">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">LV. {user.level}</span>
                </div>

                {/* XP only */}
                <div className="text-right flex items-center justify-end gap-0.5">
                  <Zap size={12} className="text-amber-500 shrink-0" />
                  <span className={cn("text-[16px] sm:text-[18px] font-black", user.is_current_user ? "text-[#1C398E]" : "text-[#101828]")}>
                    {user.xp.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
