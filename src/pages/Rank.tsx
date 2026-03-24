import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  type Variants,
} from "motion/react";
import { useRef } from "react";
import {
  Trophy,
  Flame,
  Star,
  Globe,
  Zap,
  ChevronRight,
  Lock,
  CheckCircle2,
  Crown,
  BookOpen,
  Award,
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
    image: "/src/assets/user.jpg",
  },
  {
    rank: 1,
    name: "Arjun Mehta",
    level: 24,
    xp: 2450,
    avatar: "AM",
    positionChange: 3,
    image: "/src/assets/user.jpg",
  },
  {
    rank: 3,
    name: "Leo Das",
    level: 21,
    xp: 2210,
    avatar: "LD",
    positionChange: -1,
    image: "/src/assets/user.jpg",
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
    image: "/src/assets/user.jpg",
  },
  {
    rank: 5,
    name: "You",
    level: 18,
    xp: 1850,
    avatar: "YO",
    positionChange: 2,
    isCurrentUser: true,
    image: "/src/assets/user.jpg",
  },
  {
    rank: 6,
    name: "Rohan Gupta",
    level: 17,
    xp: 1720,
    avatar: "RG",
    positionChange: -1,
    image: "/src/assets/user.jpg",
  },
  {
    rank: 7,
    name: "Zoya Ali",
    level: 16,
    xp: 1650,
    avatar: "ZA",
    positionChange: 2,
    image: "/src/assets/user.jpg",
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
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: "streak",
      label: "Streak Masters",
      icon: <Flame className="h-4 w-4" />,
    },
    { key: "best", label: "My Best", icon: <Star className="h-4 w-4" /> },
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
            className={`relative flex items-center gap-2 rounded-[14px] px-6 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
              active === t.key ? "text-blue-600" : "text-gray-500"
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
}: {
  user: LeaderboardUser;
  size: "lg" | "sm";
  delay?: number;
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
function Podium() {
  return (
    <div className="flex items-end justify-center gap-10 pb-4 pt-8">
      <div className="mt-12">
        <PodiumCard user={topThree[0]} size="sm" delay={0.2} />
      </div>
      <div>
        <PodiumCard user={topThree[1]} size="lg" delay={0} />
      </div>
      <div className="mt-12">
        <PodiumCard user={topThree[2]} size="sm" delay={0.4} />
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
        className={`text-[9px] font-black uppercase tracking-tight ${
          positive ? "text-emerald-500" : "text-red-400"
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
}: {
  user: LeaderboardUser;
  index?: number;
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
      // whileHover={
      //   !isMe ? { backgroundColor: "rgba(249,250,251,0.5)" } : undefined
      // }
      className={`flex items-center justify-between px-6 py-5 ${
        isMe
          ? "rounded-3xl bg-blue-600 text-white shadow-[0px_25px_50px_0px_#bedbff]"
          : "border-b border-gray-50"
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-5">
        <motion.div
          // whileHover={{ scale: 1.15 }}
          className={`flex h-10 w-10 items-center justify-center rounded-[14px] text-base font-black ${
            isMe ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          #{user.rank}
        </motion.div>

        <motion.div
          // whileHover={{ scale: 1.06 }}
          className="relative"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-lg font-black ${
              isMe
                ? "border-white/40 bg-blue-500 text-white"
                : "border-gray-100 bg-linear-to-br from-blue-50 to-indigo-50 text-blue-600"
            }`}
          >
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-[10px] bg-white shadow-sm">
            <Trophy
              className={`h-3 w-3 ${isMe ? "text-blue-600" : "text-amber-500"}`}
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
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isMe ? "text-blue-200" : "text-gray-400"
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
          className={`text-[10px] font-black uppercase tracking-widest ${
            isMe ? "text-blue-200" : "text-gray-400"
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Award className="h-4 w-4 text-white" />
          </motion.div>
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
              className={`flex h-[100px] w-full items-center justify-center rounded-2xl border-2 ${
                l.status === "achieved"
                  ? "border-white bg-white shadow-[0px_10px_15px_0px_rgba(28,57,142,0.2)]"
                  : l.status === "current"
                    ? "border-white bg-[#2b7fff] shadow-[0px_20px_25px_0px_rgba(81,162,255,0.4)]"
                    : "border-white/10 bg-blue-800/50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`text-[10px] font-black tracking-wide ${
                    l.status === "achieved"
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
                    <Star className="h-5 w-5 text-white" />
                  </motion.div>
                )}
                {l.status === "locked" && (
                  <Lock className="h-3 w-3 text-white/30" />
                )}
              </div>
            </div>
            <span
              className={`text-[7px] font-black uppercase tracking-tight ${
                l.status === "current" ? "text-white" : "text-blue-200/60"
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
            <Crown className="h-4 w-4 text-white" />
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
function WeeklyRivalCard() {
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
          // whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          className="mt-4 rounded-[32px] border border-gray-100 bg-gray-50 p-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              // whileHover={{ scale: 1.08 }}
              className="relative"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-linear-to-br from-pink-50 to-rose-50 text-lg font-black text-pink-600 shadow-md">
                PS
              </div>
              <motion.div
                // whileHover={{ scale: 1.15 }}
                className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-black text-white shadow-lg"
              >
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
          // whileHover={{
          //   scale: 1.03,
          //   borderColor: "#bfdbfe",
          //   backgroundColor: "rgba(239,246,255,0.5)",
          // }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full rounded-2xl border-2 border-gray-100 py-3 text-xs font-black uppercase tracking-wider text-gray-500 transition-colors"
        >
          VIEW PROFILE
        </motion.button>
      </div>
    </AnimatedSection>
  );
}

// ─── Main Page ───────────────────────────────────────

const Ranks = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("global");
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

        {/* 3. Podium */}
        <Podium />

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
                  <LeaderboardRow key={user.rank} user={user} index={i} />
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
                          <motion.div
                            // whileHover={{ scale: 1.15 }}
                            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/20 text-base font-black text-white"
                          >
                            #{user.rank}
                          </motion.div>
                          <motion.div
                            // whileHover={{ scale: 1.06 }}
                            className="relative"
                          >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/40 bg-blue-500 text-lg font-black text-white">
                              {user.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-[10px] bg-white shadow-sm">
                              <Trophy className="h-3 w-3 text-blue-600" />
                            </div>
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-black text-white">
                                {user.name}
                              </p>
                              <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="rounded-full bg-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-blue-600"
                              >
                                YOU
                              </motion.span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                                Level {user.level}
                              </span>
                              <PositionBadge change={user.positionChange} />
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
                  <LeaderboardRow key={user.rank} user={user} index={i + 2} />
                ))}
            </div>
          </div>

          {/* Right column — Sidebar */}
          <div className="w-[304px] shrink-0 space-y-6">
            <XpOverdriveCard />
            <WeeklyRivalCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ranks;
