import { useState, useRef, useEffect } from "react";
import userImage from "@/assets/user.jpg";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
} from "motion/react";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  ChevronRight,
  Lock,
  CheckCircle2,
  Crown,
  BookOpen,
  Award,
  X,
  Atom,
  FlaskConical,
  Leaf,
  Medal,
  Target,
  Users,
  PlayCircle,
  Brain,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────
type TabKey = "global" | "streak" | "best";

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  avatar: string;
  positionChange: number;
  isCurrentUser?: boolean;
  image: string;
  badges?: number;
  league?: string;
  memberType?: string;
}

interface RoadmapLevel {
  level: number;
  status: "achieved" | "current" | "locked";
}

// ─── Reusable animation variants ─────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// const fadeLeft: Variants = {
//   hidden: { opacity: 0, x: -30 },
//   visible: { opacity: 1, x: 0 },
// };

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Mock Data ───────────────────────────────────────
const topThree: LeaderboardUser[] = [
  {
    rank: 2,
    name: "Sara Khan",
    level: 22,
    xp: 2320,
    avatar: "SK",
    positionChange: 1,
    image: userImage,
    badges: 18,
    league: "Diamond League",
    memberType: "Elite Member",
  },
  {
    rank: 1,
    name: "Arjun Mehta",
    level: 24,
    xp: 2450,
    avatar: "AM",
    positionChange: 3,
    image: userImage,
    badges: 24,
    league: "Diamond League",
    memberType: "Pro Member",
  },
  {
    rank: 3,
    name: "Leo Das",
    level: 21,
    xp: 2210,
    avatar: "LD",
    positionChange: -1,
    image: userImage,
    badges: 15,
    league: "Diamond League",
    memberType: "Rising Star",
  },
];

const leaderboard: LeaderboardUser[] = [
  {
    rank: 4,
    name: "Priya Sharma",
    level: 19,
    xp: 1940,
    avatar: "PS",
    positionChange: 2,
    image: userImage,
    badges: 16,
    league: "Diamond League",
    memberType: "Active Learner",
  },
  {
    rank: 5,
    name: "You",
    level: 18,
    xp: 1850,
    avatar: "YO",
    positionChange: 2,
    isCurrentUser: true,
    image: userImage,
    badges: 12,
    league: "Diamond League",
    memberType: "Member",
  },
  {
    rank: 6,
    name: "Rohan Gupta",
    level: 17,
    xp: 1720,
    avatar: "RG",
    positionChange: -1,
    image: userImage,
    badges: 14,
    league: "Platinum League",
    memberType: "Explorer",
  },
  {
    rank: 7,
    name: "Zoya Ali",
    level: 16,
    xp: 1650,
    avatar: "ZA",
    positionChange: 2,
    image: userImage,
    badges: 10,
    league: "Platinum League",
    memberType: "Challenger",
  },
];

const roadmapLevels: RoadmapLevel[] = [
  { level: 15, status: "achieved" },
  { level: 16, status: "achieved" },
  { level: 17, status: "achieved" },
  { level: 18, status: "current" },
  { level: 19, status: "locked" },
  { level: 20, status: "locked" },
  { level: 21, status: "locked" },
  { level: 22, status: "locked" },
  { level: 23, status: "locked" },
  { level: 24, status: "locked" },
];

// ─── Streak Masters Data ─────────────────────────────

interface StreakSubject {
  name: string;
  days: number;
  status: "active" | "frozen";
  progress: number; // 0-1
  icon: React.ReactNode;
}

interface StreakUser {
  rank: number;
  name: string;
  subject: string;
  tier: string;
  streakDays: number;
  image: string;
  isCurrentUser?: boolean;
}

const streakSubjects: StreakSubject[] = [
  {
    name: "Physics",
    days: 12,
    status: "active",
    progress: 0.65,
    icon: <Atom className="h-6 w-6 text-white" />,
  },
  {
    name: "Mathematics",
    days: 7,
    status: "active",
    progress: 0.45,
    icon: <Zap className="h-6 w-6 text-white" />,
  },
  {
    name: "Biology",
    days: 0,
    status: "frozen",
    progress: 0,
    icon: <Leaf className="h-6 w-6 text-gray-400" />,
  },
  {
    name: "Chemistry",
    days: 28,
    status: "active",
    progress: 0.9,
    icon: <FlaskConical className="h-6 w-6 text-white" />,
  },
];

const streakLeaderboard: StreakUser[] = [
  {
    rank: 1,
    name: "Arjun Mehta",
    subject: "Mastering Physics",
    tier: "Elite Tier",
    streakDays: 42,
    image: userImage,
  },
  {
    rank: 2,
    name: "Zoe Chen",
    subject: "Mastering Mathematics",
    tier: "Elite Tier",
    streakDays: 38,
    image: userImage,
  },
  {
    rank: 3,
    name: "Sara Khan",
    subject: "Mastering Biology",
    tier: "Elite Tier",
    streakDays: 35,
    image: userImage,
  },
  {
    rank: 4,
    name: "You",
    subject: "Mastering Chemistry",
    tier: "Elite Tier",
    streakDays: 28,
    image: userImage,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: "Leo Rossi",
    subject: "Mastering History",
    tier: "Elite Tier",
    streakDays: 24,
    image: userImage,
  },
];

// ─── My Best Data ──────────────────────────────────────

interface LevelHistory {
  level: number;
  title: string;
  xp: string;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  earnedDate?: string;
  progress?: { current: number; max: number; label: string };
  icon: React.ReactNode;
  locked?: boolean;
}

const levelHistoryData: LevelHistory[] = [
  { level: 1, title: "Beginner Explorer", xp: "250" },
  { level: 2, title: "Knowledge Seeker", xp: "500" },
  { level: 3, title: "Smart Scholar", xp: "1,000" },
  { level: 4, title: "Rising Star", xp: "2,000" },
];

const earnedBadges: Badge[] = [
  {
    id: "early_bird_main",
    title: "Early Bird",
    description: "Jan 12, 2026",
    icon: <Medal className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "quiz_master_main",
    title: "Quiz Master",
    description: "Jan 15, 2026",
    icon: <Award className="h-6 w-6 text-blue-500" />,
  },
];

const galleryBadges: Badge[] = [
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Completed a lesson before 8 AM",
    earnedDate: "Jan 12, 2026",
    icon: <Zap className="h-6 w-6 text-orange-500" />,
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Scored 100% on 5 consecutive quizzes",
    earnedDate: "Jan 15, 2026",
    icon: <Crown className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "consistent_learner",
    title: "Consistent Learner",
    description: "Maintained a 7-day learning streak",
    earnedDate: "Jan 20, 2026",
    icon: <Flame className="h-6 w-6 text-green-500" />,
  },
  {
    id: "analytical_genius",
    title: "Analytical Genius",
    description: "Maintained low cognitive load for 3 hours",
    progress: { current: 3, max: 5, label: "3/5 hours" },
    icon: <Brain className="h-6 w-6 text-gray-400" />,
    locked: true,
  },
  {
    id: "social_star",
    title: "Social Star",
    description: "Invited 5 friends to the platform",
    progress: { current: 2, max: 5, label: "2/5 invited" },
    icon: <Users className="h-6 w-6 text-purple-500" />,
    locked: true,
  },
  {
    id: "subject_specialist",
    title: "Subject Specialist",
    description: "Complete all topics in any subject",
    progress: { current: 85, max: 100, label: "85% complete" },
    icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
    locked: true,
  },
  {
    id: "elite_competitor",
    title: "Elite Competitor",
    description: "Reach top 10 on the global leaderboard",
    progress: { current: 42, max: 100, label: "Rank #42" },
    icon: <Trophy className="h-6 w-6 text-yellow-500" />,
    locked: true,
  },
  {
    id: "video_guru",
    title: "Video Guru",
    description: "Watch 50 hours of educational content",
    progress: { current: 12, max: 50, label: "12/50 hours" },
    icon: <PlayCircle className="h-6 w-6 text-red-400" />,
    locked: true,
  },
];

// ─── Utility: Section wrapper with scroll-triggered animation ─────
function AnimatedSection({
  children,
  className = "",
  variants = fadeUp,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Profile Modal ───────────────────────────────────

function ProfileModal({
  user,
  onClose,
}: {
  user: LeaderboardUser;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const badgeColor =
    user.rank === 1
      ? "bg-yellow-400"
      : user.rank === 2
        ? "bg-gray-400"
        : user.rank === 3
          ? "bg-orange-500"
          : "bg-blue-500";

  const gradientFrom =
    user.rank === 1
      ? "from-yellow-400 to-amber-600"
      : user.rank === 2
        ? "from-gray-300 to-gray-500"
        : user.rank === 3
          ? "from-orange-400 to-orange-600"
          : "from-blue-400 to-indigo-600";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg bg-white rounded-[48px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`h-40 bg-linear-to-br ${gradientFrom} relative`}>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0px)",
              backgroundSize: "24px 24px",
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/10 hover:bg-black/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-10 pb-10 -mt-16 relative">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-[40px] border-[6px] border-white shadow-xl overflow-hidden bg-gray-100">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white ${badgeColor}`}
              >
                <span className="font-black text-white text-sm">
                  #{user.rank}
                </span>
              </div>
            </div>

            {/* Name */}
            <h3 className="text-3xl font-black text-gray-900 mb-1">
              {user.name}
            </h3>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-8">
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {user.league || "Diamond League"}
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
                {user.memberType || "Member"}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 w-full mb-10">
              <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Level
                </p>
                <p className="text-xl font-black text-gray-900">{user.level}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Total XP
                </p>
                <p className="text-xl font-black text-gray-900">
                  {user.xp.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl text-center border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Badges
                </p>
                <p className="text-xl font-black text-gray-900">
                  {user.badges ?? 0}
                </p>
              </div>
            </div>

            {/* Top Achievements */}
            <div className="w-full space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                Top Achievements
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[Zap, Star, Trophy, Award].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="shrink-0 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100"
                  >
                    <Icon className="w-6 h-6 text-yellow-500 fill-current" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Subcomponents ───────────────────────────────────

/** Hero banner at the top */
function HeroBanner() {
  return (
    <div className="relative mb-16 p-10 rounded-[48px] bg-gray-900 text-white overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 blur-[100px] -ml-48 -mb-48"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-500/30">
            <Crown size={14} className="text-yellow-400" />
            Diamond League • Season 12
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none">
            The Arena of{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
              Champions
            </span>
          </h2>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            Top 10 players this week will be promoted to the{" "}
            <span className="text-purple-400 font-bold italic">
              Legendary Tier
            </span>
            . Keep learning to secure your spot!
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
            Promotion Zone
          </p>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-black text-white">#5</span>
            <span className="text-sm font-bold text-gray-500 mb-1">/ 250</span>
          </div>
          <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-linear-to-r from-[#2b7fff] to-[#00d3f3]"
            />
          </div>
          <p className="text-[9px] font-bold text-green-400 mt-2">
            ↑ 3 RANKS THIS WEEK
          </p>
        </div>
      </div>
    </div>
  );
}

/** Tab switcher */
function TabSwitcher({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "global",
      label: "Global Ranks",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      key: "streak",
      label: "Streak Masters",
      icon: <Flame className="h-4 w-4" />,
    },
    { key: "best", label: "My Best", icon: <Award className="h-4 w-4" /> },
  ];

  return (
    <AnimatedSection className="flex justify-center">
      <div className="inline-flex items-center rounded-2xl bg-gray-100 p-1.5 shadow-inner">
        {tabs.map((t) => (
          <motion.button
            key={t.key}
            onClick={() => onChange(t.key)}
            // whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`relative flex items-center gap-2 rounded-[14px] px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${active === t.key ? "text-blue-600" : "text-gray-500"
              }`}
          >
            {active === t.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-[14px] bg-white shadow-md"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <motion.span
                animate={active === t.key ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {t.icon}
              </motion.span>
              {t.label}
            </span>
          </motion.button>
        ))}
      </div>
    </AnimatedSection>
  );
}

/** Podium avatar for top 3 */
function PodiumCard({
  user,
  size,
  delay = 0,
  onProfileClick,
}: {
  user: LeaderboardUser;
  size: "lg" | "sm";
  delay?: number;
  onProfileClick?: (user: LeaderboardUser) => void;
}) {
  const isFirst = user.rank === 1;
  const dim = size === "lg" ? "w-44 h-44" : "w-32 h-32";
  const avatarDim =
    size === "lg" ? "w-[162px] h-[162px]" : "w-[116px] h-[116px]";
  const badgeSize = "w-10 h-10";
  const badgeColor =
    user.rank === 1
      ? "bg-[#fdc700]"
      : user.rank === 2
        ? "bg-[#99a1af]"
        : "bg-[#ff6900]";
  const glowColor = "from-[#fdc700] to-[#e17100]";

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1"
    >
      {/* Avatar */}
      <motion.div
        // whileHover={{ scale: 1.08 }}
        className="group relative cursor-pointer"
        onClick={() => onProfileClick?.(user)}
      >
        {/* Glow */}
        <div
          className={`absolute inset-1 rounded-full bg-linear-to-t ${glowColor} blur-[20px]`}
        />
        {/* Ring */}
        <div
          className={`relative ${dim} rounded-full bg-linear-to-t ${glowColor}`}
        >
          <div
            className={`absolute inset-[6px] ${avatarDim} overflow-hidden rounded-full border-4 border-white bg-linear-to-br from-blue-100 to-blue-50 shadow-xl`}
          >
            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-blue-600">
              <img
                src={user.image}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Rank badge */}
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={isInView ? { scale: 1, rotate: 45 } : {}}
            transition={{
              delay: delay + 0.5,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            // whileHover={{ scale: 1.15 }}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${badgeSize} flex items-center justify-center rounded-xl ${badgeColor} shadow-xl`}
          >
            <span className="-rotate-45 text-lg font-black text-white">
              {user.rank}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Name & info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.4, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <p
          className={`font-black tracking-tight text-gray-900 ${isFirst ? "text-xl" : "text-base"}`}
        >
          {user.name}
        </p>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-600">
            LVL {user.level}
          </span>
          <span className="text-xs font-black text-gray-400">
            {user.xp.toLocaleString()} XP
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Podium section */
function Podium({
  onProfileClick,
}: {
  onProfileClick?: (user: LeaderboardUser) => void;
}) {
  return (
    <div className="flex items-end justify-center gap-10 pb-4 pt-8">
      <div className="mt-12">
        <PodiumCard
          user={topThree[0]}
          size="sm"
          delay={0.2}
          onProfileClick={onProfileClick}
        />
      </div>
      <div>
        <PodiumCard
          user={topThree[1]}
          size="lg"
          delay={0}
          onProfileClick={onProfileClick}
        />
      </div>
      <div className="mt-12">
        <PodiumCard
          user={topThree[2]}
          size="sm"
          delay={0.4}
          onProfileClick={onProfileClick}
        />
      </div>
    </div>
  );
}

/** Position change badge */
function PositionBadge({ change }: { change: number }) {
  if (change === 0) return null;
  const positive = change > 0;
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={positive ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`h-1.5 w-1.5 rounded-full ${positive ? "bg-emerald-400" : "bg-red-400"}`}
      />
      <span
        className={`text-[9px] font-black uppercase tracking-tight ${positive ? "text-emerald-500" : "text-red-400"
          }`}
      >
        {positive ? "+" : ""}
        {change} POSITION{Math.abs(change) !== 1 ? "S" : ""}
      </span>
    </div>
  );
}

/** Single row in the leaderboard */
function LeaderboardRow({
  user,
  index = 0,
  onProfileClick,
}: {
  user: LeaderboardUser;
  index?: number;
  onProfileClick?: (user: LeaderboardUser) => void;
}) {
  const isMe = user.isCurrentUser;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => !isMe && onProfileClick?.(user)}
      className={`flex items-center justify-between px-6 py-5 ${isMe
        ? "rounded-3xl bg-blue-600 text-white shadow-[0px_25px_50px_0px_#bedbff]"
        : "border-b border-gray-50 cursor-pointer hover:bg-gray-50/50 transition-colors"
        }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-5">
        <motion.div
          className={`flex h-10 w-10 items-center justify-center rounded-[14px] text-base font-black ${isMe ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
            }`}
        >
          #{user.rank}
        </motion.div>

        <motion.div className="relative">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-lg font-black ${isMe
              ? "border-white/40 bg-blue-500 text-white"
              : "border-gray-100 bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600"
              }`}
          >
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-[10px] bg-white shadow-sm">
            <Star
              className={`h-3 w-3 text-blue-600 fill-blue-600`}
            />
          </div>
        </motion.div>

        <div>
          <div className="flex items-center gap-2">
            <p
              className={`text-base font-black ${isMe ? "text-white" : "text-gray-900"}`}
            >
              {user.name}
            </p>
            {isMe && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-blue-600"
              >
                YOU
              </motion.span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isMe ? "text-blue-200" : "text-gray-400"
                }`}
            >
              Level {user.level}
            </span>
            <PositionBadge change={user.positionChange} />
          </div>
        </div>
      </div>

      {/* Right — XP */}
      <div className="text-right">
        <p
          className={`text-2xl font-black ${isMe ? "text-white" : "text-gray-900"}`}
        >
          {user.xp.toLocaleString()}
        </p>
        <p
          className={`text-[10px] font-black uppercase tracking-widest ${isMe ? "text-blue-200" : "text-gray-400"
            }`}
        >
          Total XP
        </p>
      </div>
    </motion.div>
  );
}

/** Mastery Roadmap */
function MasteryRoadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className="mt-6 border-t border-white/20 pt-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#FDC700]" />
          <span className="text-sm font-black uppercase tracking-wider text-white">
            Mastery Roadmap
          </span>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-blue-200">
          350 XP to Level 19
        </span>
      </motion.div>

      {/* Level grid */}
      <motion.div
        variants={staggerContainer}
        className="mt-4 grid grid-cols-5 gap-2"
      >
        {roadmapLevels.map((l) => (
          <motion.div
            key={l.level}
            variants={scaleUp}
            // whileHover={{ scale: 1.08, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={`flex h-[100px] w-full items-center justify-center rounded-2xl border-2 ${l.status === "achieved"
                ? "border-white bg-white shadow-[0px_10px_15px_0px_rgba(28,57,142,0.2)]"
                : l.status === "current"
                  ? "border-white bg-[#2b7fff] shadow-[0px_20px_25px_0px_rgba(81,162,255,0.4)]"
                  : "border-white/10 bg-blue-800/50"
                }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`text-[10px] font-black tracking-wide ${l.status === "achieved"
                    ? "text-blue-600"
                    : l.status === "current"
                      ? "text-white"
                      : "text-white/30"
                    }`}
                >
                  L{l.level}
                </span>
                {l.status === "achieved" && (
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                )}
                {l.status === "current" && (
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Star className="h-5 w-5 text-[#FFDF20] fill-[#FFDF20]" />
                  </motion.div>
                )}
                {l.status === "locked" && (
                  <Lock className="h-3 w-3 text-white/30" />
                )}
              </div>
            </div>
            <span
              className={`text-[7px] font-black uppercase tracking-tight ${l.status === "current" ? "text-white" : "text-blue-200/60"
                }`}
            >
              {l.status === "achieved"
                ? "Achieved"
                : l.status === "current"
                  ? "Now"
                  : "Locked"}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* How to reach next level */}
      <motion.div
        variants={fadeUp}
        className="mt-6 rounded-[32px] border border-white/10 bg-white/10 p-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            // whileHover={{ rotate: 15, scale: 1.1 }}
            className="flex h-8 w-8 items-center justify-center rounded-[14px] bg-[#fdc700]"
          >
            <Zap fill="#1C398E" className="h-4 w-4 text-[#1C398E]" />
          </motion.div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-white">
              How to reach Level 19
            </p>
            <p className="text-[9px] font-bold text-blue-200">
              Complete these challenges to ascend
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {/* Challenge 1 */}
          <motion.div
            // whileHover={{
            //   scale: 1.02,
            //   backgroundColor: "rgba(255,255,255,0.1)",
            // }}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-3.5 py-3"
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white"
            >
              <BookOpen className="h-4 w-4 text-blue-600" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white">
                  Master 3 Science Topics
                </span>
                <span className="text-[10px] font-black text-blue-100">
                  2/3
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "66%" } : {}}
                  transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-cyan-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Challenge 2 */}
          <motion.div
            // whileHover={{
            //   scale: 1.02,
            //   backgroundColor: "rgba(255,255,255,0.1)",
            // }}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-3.5 py-3"
          >
            <motion.div
              // whileHover={{ scale: 1.15 }}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-orange-500/60"
            >
              <Flame className="h-4 w-4 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white">
                  5-Day Study Streak
                </span>
                <span className="text-[10px] font-black text-blue-100">
                  4/5
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "80%" } : {}}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-orange-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        className="mt-4 flex items-center justify-center gap-8 rounded-2xl border border-white/5 bg-white/5 py-4"
      >
        <div className="text-center">
          <p className="text-[8px] font-black uppercase tracking-wider text-blue-300">
            Achieved
          </p>
          <p className="text-sm font-black text-white">18 Levels</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-[8px] font-black uppercase tracking-wider text-blue-300">
            Future
          </p>
          <p className="text-sm font-black text-white">Unlimited</p>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="text-center">
          <p className="text-[8px] font-black uppercase tracking-wider text-blue-300">
            Milestones
          </p>
          <p className="text-sm font-black text-white">12 Badges</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** XP Overdrive CTA card */
function XpOverdriveCard() {
  return (
    <AnimatedSection delay={0.1} variants={fadeRight}>
      <div
        className="relative overflow-hidden rounded-[40px] p-8 shadow-[0px_25px_50px_-12px_#bedbff]"
        style={{
          backgroundImage:
            "linear-gradient(129deg, rgb(79, 57, 246) 0%, rgb(20, 71, 230) 100%)",
        }}
      >
        {/* Animated glow */}
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-16 translate-y-16 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative space-y-5">
          <motion.div
            // whileHover={{ rotate: 15, scale: 1.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="h-7 w-7 text-white" />
            </motion.div>
          </motion.div>

          <h3 className="text-2xl font-black leading-snug text-white">
            XP Overdrive Active!
          </h3>

          <p className="text-sm leading-relaxed text-blue-200">
            Complete 3{" "}
            <span className="font-bold text-white">Hard Difficulty</span>{" "}
            quizzes today to unlock the "Mastermind" badge and gain +1000 XP.
          </p>

          <motion.button
            // whileHover={{
            //   scale: 1.03,
            //   boxShadow: "0px 25px 30px 0px rgba(28,57,142,0.35)",
            // }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-black text-blue-600 shadow-[0px_20px_25px_0px_rgba(28,57,142,0.2)]"
          >
            Accept Challenge
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </AnimatedSection>
  );
}

/** Weekly Rival card */
function WeeklyRivalCard({
  onProfileClick,
}: {
  onProfileClick?: (user: LeaderboardUser) => void;
}) {
  const rivalUser =
    leaderboard.find((u) => u.name === "Priya Sharma") ?? leaderboard[0];

  return (
    <AnimatedSection delay={0.3} variants={fadeRight}>
      <div className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900">
            Weekly
            <br />
            Rival
          </h3>
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="rounded-[10px] bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase leading-tight tracking-wider text-red-500"
          >
            CLOSET
            <br />
            COMPETITOR
          </motion.span>
        </div>

        <motion.div
          className="mt-4 rounded-[32px] border border-gray-100 bg-gray-50 p-4 cursor-pointer hover:bg-gray-100/60 transition-colors"
          onClick={() => onProfileClick?.(rivalUser)}
        >
          <div className="flex items-center gap-4">
            <motion.div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-linear-to-br from-pink-50 to-rose-50 text-lg font-black text-pink-600 shadow-md">
                PS
              </div>
              <motion.div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-black text-white shadow-lg">
                #4
              </motion.div>
            </motion.div>

            <div>
              <p className="font-bold text-gray-900">Priya Sharma</p>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                90 XP AHEAD
              </p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="h-1 w-1 rounded-full bg-orange-500"
                  />
                ))}
                <div className="h-1 w-1 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onProfileClick?.(rivalUser)}
          className="mt-4 w-full rounded-2xl border-2 border-gray-100 py-3 text-xs font-black uppercase tracking-wider text-gray-500 transition-colors cursor-pointer hover:border-blue-200 hover:bg-blue-50/50"
        >
          VIEW PROFILE
        </motion.button>
      </div>
    </AnimatedSection>
  );
}

// ─── Streak Masters Components ───────────────────────

/** Subject streak card */
function StreakSubjectCard({
  subject,
  index = 0,
}: {
  subject: StreakSubject;
  index?: number;
}) {
  const isActive = subject.status === "active";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -5 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm cursor-pointer"
    >
      {/* Decorative circle */}
      <div
        className={`absolute -top-8 right-[-10px] h-24 w-24 rounded-full transition-all duration-300 opacity-5 group-hover:scale-150 group-hover:opacity-10 ${isActive ? "bg-orange-500" : "bg-gray-500"
          }`}
      />

      {/* Icon + Label */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:rotate-12 ${isActive ? "bg-orange-500" : "bg-gray-200"
            }`}
        >
          {subject.icon}
        </div>
        <div>
          <p className="text-sm font-black tracking-tight text-gray-900">
            {subject.name}
          </p>
          <span
            className={`inline-block mt-1 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${isActive
              ? "bg-orange-50 text-orange-600"
              : "bg-gray-100 text-gray-400"
              }`}
          >
            {subject.status}
          </span>
        </div>
      </div>

      {/* Days + progress */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            className="text-4xl font-black tracking-tight text-gray-900"
          >
            {subject.days}
          </motion.span>
          <span className="text-xs font-bold text-gray-400">DAYS</span>
        </div>
        <div className="h-1 w-10 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${subject.progress * 100}%` } : {}}
            transition={{
              delay: index * 0.1 + 0.4,
              duration: 0.8,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${isActive ? "bg-orange-500" : "bg-gray-300"
              }`}
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Streak leaderboard row */
function StreakLeaderboardRow({
  user,
  index = 0,
}: {
  user: StreakUser;
  index?: number;
}) {
  const isMe = user.isCurrentUser;
  const isFirst = user.rank === 1;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const rankStr = String(user.rank).padStart(2, "0");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex items-center justify-between px-8 py-7 ${isMe
        ? "bg-orange-50 border-x-4 border-b border-orange-500 border-b-gray-50"
        : "border-b border-gray-50"
        }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-8">
        {/* Rank number */}
        <span
          className={`text-lg font-black italic tracking-tight ${isMe ? "text-gray-300" : "text-orange-500"
            }`}
        >
          {rankStr}
        </span>

        {/* Avatar */}
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border-2 border-gray-100 shadow-sm">
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          {isFirst && (
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute -right-1 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-400 shadow-lg"
            >
              <Crown className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold tracking-tight text-gray-900">
              {user.name}
            </p>
            {isMe && (
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-2xl bg-orange-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-200"
              >
                YOU
              </motion.span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-orange-500">
              {user.subject}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-gray-400">{user.tier}</span>
          </div>
        </div>
      </div>

      {/* Right — Streak */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <motion.span
              initial={{ scale: 0.5 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="text-4xl font-black tracking-tight text-gray-900"
            >
              {user.streakDays}
            </motion.span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="h-8 w-8 text-orange-500 fill-orange-500" />
            </motion.div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 text-right">
            Day Learning Streak
          </p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-300" />
      </div>
    </motion.div>
  );
}

/** Full Streak Masters tab content */
function StreakMastersContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10"
    >
      {/* Subject Streak Cards */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {streakSubjects.map((subject, i) => (
          <StreakSubjectCard key={subject.name} subject={subject} index={i} />
        ))}
      </div>

      {/* Consistency Champions Card */}
      <div className="overflow-hidden rounded-[40px] border border-gray-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-r from-gray-50 to-white px-10 py-10 border-b border-gray-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded-xl bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                Top Consistency
              </span>
              <h3 className="text-2xl font-black tracking-tight text-gray-900">
                Consistency Champions
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Global ranking based on consecutive days of learning.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 shadow-[0px_20px_25px_0px_#ffd6a8]"
          >
            <Flame className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        {/* Leaderboard rows */}
        <div>
          {streakLeaderboard.map((user, i) => (
            <StreakLeaderboardRow key={user.rank} user={user} index={i} />
          ))}
        </div>

        {/* Dark footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gray-900 px-8 py-8"
        >
          <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            You're in the Top 15% of consistent learners
          </p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.3 }}
                className="h-2 w-10 rounded-full bg-orange-500"
              />
            ))}
            {[5, 6, 7].map((i) => (
              <div key={i} className="h-2 w-10 rounded-full bg-white/10" />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── My Best Components ──────────────────────────────

function MyBestContent() {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 space-y-16"
    >
      {/* 1. Active Standing */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
            Active Standing
          </h2>
        </div>

        <div className="flex gap-6">
          {/* Level Progress Card */}
          <div className="flex-1 rounded-[40px] border border-gray-100 bg-white p-10 shadow-sm flex items-center gap-10">
            <div className="relative h-40 w-40 shrink-0">
              <svg
                className="h-full w-full -rotate-90 transform"
                viewBox="0 0 100 100"
              >
                <circle
                  className="text-gray-100 stroke-current"
                  strokeWidth="8"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-blue-600 stroke-current"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset="87.92" // 65% progress
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black tracking-tight text-gray-900">
                  18
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Level
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Intermediate Scholar
              </h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm">
                You've reached the current peak! Your progress is at{" "}
                <span className="font-bold text-blue-600">65%</span> towards the
                next level.
              </p>
              <div className="flex gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 border border-blue-100">
                  Silver Badge
                </span>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 border border-blue-100">
                  Custom Avatar
                </span>
              </div>
            </div>
          </div>

          {/* Main Badge Card */}
          <div className="w-[304px] shrink-0 overflow-hidden rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-700 p-10 text-center relative shadow-[0px_20px_25px_-5px_rgba(190,219,255,0.5)]">
            <div className="absolute top-[-80px] -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl mix-blend-overlay" />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/20 shadow-xl border border-white/20 mb-6 backdrop-blur-md">
              <Star className="h-8 w-8 text-white" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">
              Main Badge
            </p>
            <h3 className="text-xl font-black text-white mb-2 leading-tight">
              Consistent Learner
            </h3>
            <p className="text-xs text-blue-200/80">
              Equipped as your primary showcase achievement.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mastered History */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-green-500 rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
            Mastered History
          </h2>
        </div>

        <div className="flex gap-12">
          {/* Earned Badges */}
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
              Earned Badges
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-[32px] border border-gray-100 bg-white p-6 text-center shadow-sm cursor-pointer transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {badge.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Level History */}
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
              Level History
            </h3>
            <div className="space-y-3">
              {levelHistoryData.map((lvl, i) => (
                <motion.div
                  key={lvl.level}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between rounded-[32px] border border-cyan-200 bg-cyan-50 px-6 py-4"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-teal-600 text-lg font-black text-white shadow-md">
                      {lvl.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        {lvl.title}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-0.5">
                        Completed • {lvl.xp} XP
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-teal-600" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Badge Gallery */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
              Badge Gallery
            </h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                3 Earned
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                5 Locked
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {galleryBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={`relative rounded-[32px] border p-6 shadow-sm transition-all duration-300 group cursor-pointer ${badge.locked
                ? "border-gray-100 bg-gray-50/50 opacity-60 grayscale"
                : "border-blue-100 bg-white hover:shadow-md"
                }`}
            >
              {badge.locked && (
                <div className="absolute top-4 right-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-100 bg-white/80 backdrop-blur-sm">
                    <X className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              )}

              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 ${badge.locked ? "bg-gray-200 text-gray-400" : "bg-gray-100/80"
                  }`}
              >
                {badge.icon}
              </div>
              <h4
                className={`text-sm font-black mb-1 ${badge.locked ? "text-gray-500" : "text-gray-900"
                  }`}
              >
                {badge.title}
              </h4>
              <p className="text-[10px] font-bold text-gray-400 mb-4 h-8 leading-relaxed line-clamp-2">
                {badge.description}
              </p>

              {badge.earnedDate && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">
                    Achieved
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">
                    {badge.earnedDate}
                  </span>
                </div>
              )}

              {badge.progress && (
                <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Progress
                    </span>
                    <span className="text-[8px] font-black text-gray-900">
                      {badge.progress.label}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-blue-600 opacity-50"
                      style={{
                        width: `${(badge.progress.current / badge.progress.max) * 100
                          }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Next Evolution */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-orange-500 rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
            Next Evolution
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Priority Challenge */}
          <div className="relative overflow-hidden rounded-[40px] bg-gray-900 p-8 shadow-xl flex items-center gap-8">
            <div className="absolute top-[-100px] -right-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
              <Brain className="h-10 w-10 text-white/80" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 mb-4">
                <Target className="h-3 w-3 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  Priority Challenge
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Analytical Genius
              </h3>
              <p className="text-sm text-gray-400 max-w-[250px] mb-6">
                Maintained low cognitive load for 3 hours
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-blue-200">Requirement</span>
                  <span className="text-gray-400">3/5 Hours</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Levels */}
          <div className="flex flex-col gap-4">
            <div className="p-8 bg-white rounded-[40px] border border-gray-100 flex items-center gap-8 group hover:border-blue-200 transition-all shadow-sm hover:translate-x-2.5">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl transition-all shadow-lg bg-blue-600 text-white shadow-blue-200">
                19
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  Advanced Analyst
                </h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-md group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">
                    2x XP Booster
                  </span>
                  <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-md group-hover:bg-blue-50 group-hover:text-blue-400 transition-colors">
                    Exclusive Courses
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-gray-100 flex items-center gap-8 group hover:border-gray-300 transition-all shadow-sm hover:translate-x-2.5">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl transition-all shadow-inner bg-gray-50 text-gray-400">
                20
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  Master Learner
                </h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-md group-hover:bg-blue-50 group-hover:text-blue-400  transition-colors">
                    Gold Certification
                  </span>
                  <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-md group-hover:bg-blue-50 group-hover:text-blue-400  transition-colors">
                    AI Mentor Access
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────

const Ranks = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("global");
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(
    null,
  );
  const leaderboardRef = useRef(null);
  const leaderboardInView = useInView(leaderboardRef, {
    once: true,
    margin: "-40px",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* CSS keyframes for gradient shift */}
      <style>{`
        @keyframes rank-gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <main className="max-w-5xl mx-auto px-6 py-10 pb-32">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Tab Switcher */}
        <div className="mt-10">
          <TabSwitcher active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "global" && (
            <motion.div
              key="global"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 3. Podium */}
              <Podium onProfileClick={setSelectedUser} />

              {/* 4. Main content area */}
              <div className="mt-12 flex gap-6">
                {/* Left column — Leaderboard */}
                <div className="flex-1">
                  {/* Table header */}
                  <AnimatedSection className="flex items-center justify-between rounded-2xl bg-gray-50 px-8 py-3">
                    <div className="flex gap-12">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Rank
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Learner
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Total XP
                    </span>
                  </AnimatedSection>

                  {/* Leaderboard card */}
                  <div
                    ref={leaderboardRef}
                    className="mt-4 overflow-hidden rounded-[40px] border border-gray-100 shadow-xl"
                  >
                    {/* Users above "you" */}
                    {leaderboard
                      .filter((u) => !u.isCurrentUser && u.rank < 5)
                      .map((user, i) => (
                        <LeaderboardRow
                          key={user.rank}
                          user={user}
                          index={i}
                          onProfileClick={setSelectedUser}
                        />
                      ))}

                    {/* "Your" blue card with mastery */}
                    <AnimatePresence>
                      {leaderboard
                        .filter((u) => u.isCurrentUser)
                        .map((user) => (
                          <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={
                              leaderboardInView ? { opacity: 1, scale: 1 } : {}
                            }
                            transition={{
                              delay: 0.15,
                              duration: 0.6,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="rounded-3xl bg-blue-600 p-6 shadow-[0px_25px_50px_0px_#bedbff]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                <motion.div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/20 text-base font-black text-white">
                                  #{user.rank}
                                </motion.div>
                                <motion.div className="relative">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/40 bg-blue-500 text-lg font-black text-white">
                                    {user.avatar}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-[10px] bg-white shadow-sm">
                                    <Star className="h-3 w-3 text-blue-600 fill-blue-600" />
                                  </div>
                                </motion.div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-lg font-black text-white">
                                      {user.name}
                                    </p>
                                    <motion.span
                                      animate={{ opacity: [1, 0.5, 1] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                      }}
                                      className="rounded-full bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-blue-600"
                                    >
                                      YOU
                                    </motion.span>
                                  </div>
                                  <div className="mt-0.5 flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                                      Level {user.level}
                                    </span>
                                    <PositionBadge
                                      change={user.positionChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-black text-white">
                                  {user.xp.toLocaleString()}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                                  Total XP
                                </p>
                              </div>
                            </div>
                            <MasteryRoadmap />
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Users below "you" */}
                    {leaderboard
                      .filter((u) => !u.isCurrentUser && u.rank > 5)
                      .map((user, i) => (
                        <LeaderboardRow
                          key={user.rank}
                          user={user}
                          index={i + 2}
                          onProfileClick={setSelectedUser}
                        />
                      ))}
                  </div>
                </div>

                {/* Right column — Sidebar */}
                <div className="w-[304px] shrink-0 space-y-6">
                  <XpOverdriveCard />
                  <WeeklyRivalCard onProfileClick={setSelectedUser} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "streak" && <StreakMastersContent key="streak" />}

          {activeTab === "best" && <MyBestContent key="best" />}
        </AnimatePresence>
      </main>

      {/* Profile Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <ProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ranks;
