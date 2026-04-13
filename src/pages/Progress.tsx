import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
  useInView,
} from "framer-motion";
import {
  Info,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  Zap,
  Share2,
  Medal,
  Award,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Topic {
  id: string;
  category: string;
  title: string;
  status: "mastered" | "in-progress" | "needs-work" | "not-started";
  percentage?: number;
  attempts?: number;
  lastStudied?: string;
}

const topics: Topic[] = [
  {
    id: "1",
    category: "Maths",
    title: "Algebra Basics",
    status: "mastered",
    percentage: 92,
    attempts: 5,
    lastStudied: "2 days ago",
  },
  {
    id: "2",
    category: "Maths",
    title: "Trigonometry",
    status: "in-progress",
    percentage: 61,
    attempts: 3,
    lastStudied: "3 days ago",
  },
  {
    id: "3",
    category: "Physics",
    title: "Laws of Motion",
    status: "mastered",
    percentage: 85,
    attempts: 4,
    lastStudied: "1 week ago",
  },
  {
    id: "4",
    category: "Physics",
    title: "Electromagnetism",
    status: "needs-work",
    percentage: 38,
    attempts: 2,
    lastStudied: "5 days ago",
  },
  {
    id: "5",
    category: "Chemistry",
    title: "Periodic Table",
    status: "mastered",
    percentage: 95,
    attempts: 6,
    lastStudied: "Yesterday",
  },
  {
    id: "6",
    category: "Chemistry",
    title: "Organic Chemistry",
    status: "needs-work",
    percentage: 42,
    attempts: 2,
    lastStudied: "4 days ago",
  },
  {
    id: "7",
    category: "Biology",
    title: "Cell Biology",
    status: "in-progress",
    percentage: 78,
    attempts: 3,
    lastStudied: "3 days ago",
  },
  { id: "8", category: "Biology", title: "Genetics", status: "not-started" },
  {
    id: "9",
    category: "History",
    title: "World War I",
    status: "mastered",
    percentage: 88,
    attempts: 4,
    lastStudied: "2 weeks ago",
  },
  {
    id: "10",
    category: "History",
    title: "French Revolution",
    status: "in-progress",
    percentage: 55,
    attempts: 2,
    lastStudied: "1 day ago",
  },
  {
    id: "11",
    category: "Geography",
    title: "Plate Tectonics",
    status: "not-started",
  },
  {
    id: "12",
    category: "Geography",
    title: "Climate Change",
    status: "in-progress",
    percentage: 72,
    attempts: 3,
    lastStudied: "6 days ago",
  },
];

const subjectData = [
  { name: "Maths", mastery: 85 },
  { name: "Physics", mastery: 72 },
  { name: "Chemistry", mastery: 90 },
  { name: "Biology", mastery: 78 },
  { name: "History", mastery: 95 },
  { name: "Geography", mastery: 55 },
];

const xpData = [
  { week: "Week 1", xp: 40 },
  { week: "Week 2", xp: 65 },
  { week: "Week 3", xp: 80 },
  { week: "Week 4", xp: 100 },
];

const weeklyData = {
  minutes: [
    { day: "Mon", val: 40 },
    { day: "Tue", val: 65 },
    { day: "Wed", val: 30 },
    { day: "Thu", val: 80 },
    { day: "Fri", val: 50 },
    { day: "Sat", val: 95 },
    { day: "Sun", val: 35 },
  ],
  score: [
    { day: "Mon", val: 60 },
    { day: "Tue", val: 75 },
    { day: "Wed", val: 55 },
    { day: "Thu", val: 85 },
    { day: "Fri", val: 70 },
    { day: "Sat", val: 90 },
    { day: "Sun", val: 65 },
  ],
  topics: [
    { day: "Mon", val: 2 },
    { day: "Tue", val: 3 },
    { day: "Wed", val: 1 },
    { day: "Thu", val: 4 },
    { day: "Fri", val: 2 },
    { day: "Sat", val: 5 },
    { day: "Sun", val: 2 },
  ],
};

const tabs = [
  { key: "minutes", label: "STUDY MINUTES" },
  { key: "score", label: "AVG SCORE" },
  { key: "topics", label: "TOPICS COVERED" },
];

export default function Progress() {
  const [filter, setFilter] = useState<Topic["status"] | "all">("all");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);

  const filteredTopics = topics.filter(
    (t) => filter === "all" || t.status === filter,
  );

  const stats = {
    mastered: topics.filter((t) => t.status === "mastered").length,
    inProgress: topics.filter((t) => t.status === "in-progress").length,
    needsWork: topics.filter((t) => t.status === "needs-work").length,
    notStarted: topics.filter((t) => t.status === "not-started").length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#101828] tracking-tight">
            My Learning Hub
          </h1>
          <p className="text-[#6a7282] text-[16px]">
            Track progress, set goals, and discover what to learn next
          </p>
        </div>

        {/* Knowledge Map Card */}
        <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl p-8 mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                    Knowledge Map
                  </h3>
                  <button
                    onClick={() => setShowExplainer(!showExplainer)}
                    className={`transition-all duration-300 p-1 rounded-md ${showExplainer ? "bg-blue-50 text-[#1447e6]" : "text-[#101828] hover:bg-gray-50"}`}
                  >
                    <Info size={16} />
                  </button>
                </div>
                <p className="text-[12px] text-[#6a7282]">
                  Visual mastery zones across all topics
                </p>
              </div>
            </div>

            {/* Explainer Box */}
            <AnimatePresence>
              {showExplainer && (
                <motion.div
                  initial={{ height: 0, opacity: 0, margin: 0 }}
                  animate={{ height: "auto", opacity: 1, margin: "0.5rem 0" }}
                  exit={{ height: 0, opacity: 0, margin: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-[16px] p-5">
                    <p className="text-[12px] text-[#1447e6] leading-relaxed">
                      <span className="font-bold">Knowledge Map</span> shows how
                      well you've mastered each topic.
                      <span className="text-[#007a55] font-bold">
                        {" "}
                        Green
                      </span>{" "}
                      means mastered (≥80%),
                      <span className="text-[#e17100] font-bold">
                        {" "}
                        Yellow
                      </span>{" "}
                      means in progress (50–79%), and
                      <span className="text-[#e7000b] font-bold">
                        {" "}
                        Red
                      </span>{" "}
                      means it needs more work (&lt;50%). Gray tiles haven't
                      been started yet.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All Topics ({topics.length})
              </FilterButton>
              <FilterButton
                active={filter === "mastered"}
                onClick={() => setFilter("mastered")}
                color="#00bc7d"
              >
                Mastered ({stats.mastered})
              </FilterButton>
              <FilterButton
                active={filter === "in-progress"}
                onClick={() => setFilter("in-progress")}
                color="#fe9a00"
              >
                In Progress ({stats.inProgress})
              </FilterButton>
              <FilterButton
                active={filter === "needs-work"}
                onClick={() => setFilter("needs-work")}
                color="#fb2c36"
              >
                Needs Work ({stats.needsWork})
              </FilterButton>
              <FilterButton
                active={filter === "not-started"}
                onClick={() => setFilter("not-started")}
                color="#d1d5dc"
              >
                Not Started ({stats.notStarted})
              </FilterButton>
            </div>

            {/* Progress Overview Bar */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-5">
              <div className="flex gap-2 mb-3">
                <span className="font-black text-[10px] text-[#99a1af] uppercase tracking-[1.1px]">
                  Overall Mastery
                </span>
                <span className="font-bold text-[10px] text-[#99a1af]">
                  33% complete
                </span>
              </div>
              <div className="h-4 w-full flex gap-[2px] rounded-full overflow-hidden mb-4 bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "32%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="bg-[#00bc7d]"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "32%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="bg-[#ffb900]"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "18%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="bg-[#ff6467]"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "18%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="bg-[#e5e7eb]"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <LegendItem color="#00bc7d" label="4 Mastered" />
                <LegendItem color="#fe9a00" label="4 In Progress" />
                <LegendItem color="#fb2c36" label="2 Needs Work" />
                <LegendItem color="#d1d5dc" label="2 Not Started" />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={() => setSelectedTopic(topic)}
                />
              ))}
            </div>
          </div>
        </div>

        <WeeklyActivity />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Mastery Bar Chart */}
          <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                  Subject Mastery
                </h3>
                <p className="text-[12px] text-[#6a7282]">
                  Your proficiency across subjects
                </p>
              </div>
              {/* <Medal size={20} className="text-[#155dfc]" /> */}
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} barCategoryGap={20}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis hide domain={[0, 100]} />

                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{ borderRadius: 12, border: "none" }}
                  />

                  <Bar
                    dataKey="mastery"
                    fill="#3B82F6"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* XP Growth Chart */}
          <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                  XP Growth
                </h3>
                <p className="text-[12px] text-[#6a7282]">
                  Monthly XP accumulation
                </p>
              </div>
              {/* <Flame size={20} className="text-[#fe9a00]" /> */}
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xpData} barCategoryGap={30}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />

                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis hide />

                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{ borderRadius: 12, border: "none" }}
                  />

                  <Bar dataKey="xp" fill="#8B5CF6" radius={[10, 10, 0, 0]} />

                  {/* Gradient */}
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f39f6" />
                      <stop offset="100%" stopColor="#155dfc" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insight Gradient Card */}
        <div className="bg-linear-to-r from-[#155dfc] to-[#4f39f6] rounded-[32px] p-8 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-150 group-hover:scale-[2] transition-transform duration-700">
            <Sparkles size={120} />
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-[#dbeafe] text-[14px] font-black uppercase tracking-[1.2px] mb-1">
                AI Insight
              </h3>
              <p className="text-white text-[14px] leading-relaxed max-w-3xl">
                Your Geography mastery is at 55% - the lowest among your
                subjects. Consider spending 20 extra minutes this week on Plate
                Tectonics. Students who improved Geography saw a{" "}
                <span className="font-black">15% boost in overall scores.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Adaptive Goals & Suggested Next Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Adaptive Goals */}
          <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl overflow-hidden">
            <div className="p-8 border-b border-[#f9fafb] bg-orange-50/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ffedd4] rounded-[14px] flex items-center justify-center">
                  <Target size={20} className="text-[#f54900]" />
                </div>
                <div>
                  <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                    Adaptive Goals
                  </h3>
                  <p className="text-[12px] text-[#6a7282]">
                    AI-personalized based on performance
                  </p>
                </div>
              </div>
              <div className="bg-[#fff7ed] border border-[#ffedd4] px-3 py-1 rounded-full text-[#f54900] text-[10px] font-black uppercase tracking-wider">
                4 Active
              </div>
            </div>
            <div className="p-6 space-y-4">
              <GoalItem
                title="Master Trigonometry"
                desc="Based on your 65% score, practice 3 more problems"
                priority="high"
                progress={45}
                deadline="Today"
                xp="150"
              />
              <GoalItem
                title="Review Electromagnetism"
                desc="Your response time indicates difficulty - rewatch video"
                priority="critical"
                progress={20}
                deadline="Today"
                xp="200"
              />
              <GoalItem
                title="Complete Organic Chemistry Quiz"
                desc="You're performing well - ready for advanced assessment"
                priority="medium"
                progress={80}
                deadline="Tomorrow"
                xp="100"
              />
              <GoalItem
                title="Read French Revolution Notes"
                desc="Maintain your 90% streak in History"
                priority="low"
                progress={60}
                deadline="This week"
                xp="75"
              />
            </div>
          </div>

          {/* Suggested Next */}
          <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl overflow-hidden">
            <div className="p-8 border-b border-[#f9fafb] bg-purple-50/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f3e8ff] rounded-[14px] flex items-center justify-center">
                  <Sparkles size={24} className="text-[#9810fa]" />
                </div>
                <div>
                  <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                    Suggested Next
                  </h3>
                  <p className="text-[12px] text-[#6a7282]">
                    AI-curated modules for your path
                  </p>
                </div>
              </div>
              <div className="bg-[#faf5ff] border border-[#f3e8ff] px-3 py-1 rounded-full text-[#9810fa] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Brain size={14} />
                AI Powered
              </div>
            </div>
            <div className="p-6 space-y-4">
              <SuggestionItem
                title="Quadratic Equations"
                category="Maths"
                type="video"
                desc="Builds on your Algebra Basics mastery"
                duration="22 min"
                difficulty="Medium"
                match="98%"
              />
              <SuggestionItem
                title="Wave Optics"
                category="Physics"
                type="video"
                desc="Next in your Physics learning path"
                duration="18 min"
                difficulty="Hard"
                match="92%"
              />
              <SuggestionItem
                title="Chemical Bonding Quiz"
                category="Chemistry"
                type="quiz"
                desc="Test your Periodic Table knowledge"
                duration="10 min"
                difficulty="Medium"
                match="88%"
              />
              <SuggestionItem
                title="World War II Overview"
                category="History"
                type="video"
                desc="Continues from French Revolution study"
                duration="25 min"
                difficulty="Easy"
                match="96%"
              />
            </div>
          </div>
        </div>

        {/* My Certificates Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#f3e8ff] rounded-[14px] flex items-center justify-center">
              <Award size={20} className="text-[#9810fa]" />
            </div>
            <div>
              <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
                My Certificates
              </h3>
              <p className="text-[12px] text-[#6a7282]">
                Share your achievements on social media
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CertificateCard
              title="Algebra Basics"
              subject="Mathematics"
              score={92}
              date="Feb 15, 2026"
              distinction={true}
              color="#d0fae5"
              icon={<Award className="text-[#00bc7d]" />}
            />
            <CertificateCard
              title="Laws of Motion"
              subject="Physics"
              score={88}
              date="Feb 10, 2026"
              distinction={false}
              color="#dbeafe"
              icon={<Award className="text-[#155dfc]" />}
            />
            <CertificateCard
              title="Periodic Table"
              subject="Chemistry"
              score={95}
              date="Feb 05, 2026"
              distinction={true}
              color="#d0fae5"
              icon={<Award className="text-[#00bc7d]" />}
            />
            <CertificateCard
              title="Cell Biology"
              subject="Biology"
              score={78}
              date="Jan 28, 2026"
              distinction={false}
              color="#fef3c6"
              icon={<Award className="text-[#fe9a00]" />}
            />
          </div>
        </div>
      </div>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <TopicDetailModal
            topic={selectedTopic}
            onClose={() => setSelectedTopic(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function FilterButton({
  children,
  active,
  onClick,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full border transition-all flex items-center gap-2 ${active
        ? "bg-[#101828] border-[#101828] text-white"
        : "bg-white border-[#e5e7eb] text-[#6a7282] hover:bg-gray-50"
        }`}
    >
      {color && !active && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-[10px] font-black uppercase tracking-[1.1px]">
        {children}
      </span>
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[9px] font-bold text-[#6a7282] tracking-[0.16px]">
        {label}
      </span>
    </div>
  );
}

function TopicCard({ topic, onClick }: { topic: Topic; onClick: () => void }) {
  const statusConfig = {
    mastered: {
      bg: "#d0fae5",
      border: "#5ee9b5",
      text: "#006045",
      iconColor: "#00bc7d",
      label: "Mastered",
    },
    "in-progress": {
      bg: "#fef3c6",
      border: "#ffd230",
      text: "#973c00",
      iconColor: "#fe9a00",
      label: "In Progress",
    },
    "needs-work": {
      bg: "#ffe2e2",
      border: "#ffa2a2",
      text: "#9f0712",
      iconColor: "#fb2c36",
      label: "Needs Work",
    },
    "not-started": {
      bg: "#f3f4f6",
      border: "#e5e7eb",
      text: "#6a7282",
      iconColor: "#d1d5dc",
      label: "Not Started",
    },
  };
  const config = statusConfig[topic.status];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`relative rounded-[20px] p-4 cursor-pointer border-2 shadow-sm transition-all h-[99px] flex flex-col justify-between`}
      style={{ backgroundColor: config.bg, borderColor: config.border }}
    >
      <div>
        <p
          className="text-[9px] font-black uppercase tracking-[1.5px]"
          style={{ color: config.text }}
        >
          {topic.category}
        </p>
        <p
          className="text-[14px] font-bold tracking-tight mt-1 truncate"
          style={{ color: config.text }}
        >
          {topic.title}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: config.iconColor }}
        >
          <CheckCircle2 size={10} className="text-white" />
          <span className="text-[8px] font-black text-white uppercase">
            {config.label}
          </span>
        </div>
        {topic.percentage && (
          <span
            className="text-[12px] font-black"
            style={{ color: config.text }}
          >
            {topic.percentage}%
          </span>
        )}
      </div>
      <div
        className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: config.iconColor }}
      />
    </motion.div>
  );
}

function GoalItem({ title, desc, priority, progress, deadline, xp }: any) {
  const priorityColors: any = {
    critical: { bg: "#ffe2e2", text: "#e7000b", border: "#ffc9c9" },
    high: { bg: "#ffedd4", text: "#f54900", border: "#ffd6a8" },
    medium: { bg: "#dbeafe", text: "#155dfc", border: "#bedbff" },
    low: { bg: "#d0fae5", text: "#009966", border: "#a4f4cf" },
  };
  const p = priorityColors[priority];
  return (
    <div className="bg-white border border-[#f3f4f6] rounded-[24px] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <button className="w-6 h-6 rounded-[10px] border-2 border-[#e5e7eb] mt-0.5 hover:border-[#155dfc] transition-colors" />
          <div>
            <h4 className="text-[14px] font-bold text-[#101828] mb-1">
              {title}
            </h4>
            <p className="text-[12px] text-[#6a7282]">{desc}</p>
          </div>
        </div>
        <div
          className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border"
          style={{
            backgroundColor: p.bg,
            color: p.text,
            borderColor: p.border,
          }}
        >
          {priority}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-[160px]">
          <div className="flex-1 h-[6px] bg-[#f3f4f6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#155dfc]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#99a1af]">
            {progress}%
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#99a1af]">
            <Calendar size={12} />
            <span className="text-[10px] font-bold">{deadline}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#155dfc]">
            <Zap size={12} />
            <span className="text-[10px] font-black">+{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionItem({
  title,
  type,
  desc,
  duration,
  difficulty,
  match,
}: any) {
  return (
    <div className="border border-[#f9fafb] rounded-[24px] p-5 flex items-center gap-5 hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="relative">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${type === "video" ? "bg-[#dbeafe]" : "bg-[#d0fae5]"}`}
        >
          {type === "video" ? (
            <Play size={24} className="text-[#155dfc]" fill="currentColor" />
          ) : (
            <Brain size={24} className="text-[#00bc7d]" />
          )}
        </div>
        <div className="absolute -top-1 -right-1 bg-[#155dfc] text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg border-2 border-white shadow-sm">
          {match}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-[16px] font-bold text-[#101828] truncate">
            {title}
          </h4>
          <span className="px-2 py-0.5 bg-[#eff6ff] text-[#155dfc] text-[8px] font-black uppercase tracking-widest rounded-lg">
            {type}
          </span>
        </div>
        <p className="text-[11px] text-[#6a7282] mb-2">{desc}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#99a1af]">
            <Clock size={12} />
            <span className="text-[10px] font-bold">{duration}</span>
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${difficulty === "Hard" ? "text-[#ff2056]" : difficulty === "Medium" ? "text-[#fe9a00]" : "text-[#00bc7d]"}`}
          >
            {difficulty}
          </span>
        </div>
      </div>
      <div className="w-10 h-10 bg-[#f9fafb] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={20} className="text-[#101828]" />
      </div>
    </div>
  );
}

function CertificateCard({
  title,
  subject,
  score,
  date,
  distinction,
  color,
  icon,
}: any) {
  return (
    <div className="bg-white border border-[#f3f4f6] rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <span className="text-[10px] font-black text-[#99a1af] uppercase tracking-widest">
          {date}
        </span>
      </div>
      <h4 className="text-[16px] font-bold text-[#101828] mb-1">{title}</h4>
      <p className="text-[12px] text-[#6a7282] mb-6">{subject}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="bg-[#f9fafb] px-3 py-1 rounded-xl text-[10px] font-black text-[#4a5565]">
            Score: {score}%
          </div>
          {distinction && (
            <div className="bg-[#ecfdf5] px-3 py-1 rounded-xl text-[10px] font-black text-[#009966] flex items-center gap-1">
              <Medal size={10} />
              Distinction
            </div>
          )}
        </div>
        <button className="text-[#99a1af] hover:text-[#155dfc] transition-colors">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}

function TopicDetailModal({
  topic,
  onClose,
}: {
  topic: Topic;
  onClose: () => void;
}) {
  const statusConfig: any = {
    mastered: {
      bg: "#d0fae5",
      text: "#006045",
      accent: "#00bc7d",
      icon: <CheckCircle2 size={14} />,
      label: "Mastered",
    },
    "in-progress": {
      bg: "#fef3c6",
      text: "#973c00",
      accent: "#fe9a00",
      icon: <RotateCcw size={14} />,
      label: "In Progress",
    },
    "needs-work": {
      bg: "#ffe2e2",
      text: "#9f0712",
      accent: "#fb2c36",
      icon: <Target size={14} />,
      label: "Needs Work",
    },
    "not-started": {
      bg: "#f3f4f6",
      text: "#4a5565",
      accent: "#d1d5dc",
      icon: <Play size={14} />,
      label: "Not Started",
    },
  };
  const config = statusConfig[topic.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        layoutId={`card-${topic.id}`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-[384px] rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div style={{ backgroundColor: config.bg }} className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p
                className="text-[9px] font-black uppercase tracking-[1.1px]"
                style={{ color: config.text }}
              >
                {topic.category}
              </p>
              <h2
                className="text-[18px] font-black tracking-tight"
                style={{ color: config.text }}
              >
                {topic.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white"
            style={{ backgroundColor: config.accent }}
          >
            {config.icon}
            <span className="text-[9px] font-black uppercase tracking-[0.2px]">
              {config.label}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="transparent"
                />
                {topic.percentage && (
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={config.accent}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={213.6}
                    initial={{ strokeDashoffset: 213.6 }}
                    animate={{
                      strokeDashoffset:
                        213.6 - (213.6 * topic.percentage) / 100,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[14px] font-black">
                {topic.percentage ? `${topic.percentage}%` : "—"}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                  Attempts
                </p>
                <p className="text-[16px] font-black text-[#101828]">
                  {topic.attempts || "0"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                  Last Studied
                </p>
                <p className="text-[16px] font-black text-[#101828]">
                  {topic.lastStudied || "Not yet"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="p-5 rounded-[16px] border"
            style={{
              backgroundColor: config.bg,
              borderColor: config.accent + "44",
            }}
          >
            <p
              className="text-[12px] font-bold leading-relaxed"
              style={{ color: config.text }}
            >
              {topic.status === "mastered"
                ? "🎉 Excellent work! You've mastered this topic. Keep it up!"
                : topic.status === "in-progress"
                  ? "📚 Good progress! A few more practice sessions will push you into the mastered zone."
                  : topic.status === "needs-work"
                    ? "⚡ Focus on this area. Reviewing the basic concepts will help improve your score."
                    : "🚀 Ready to start? This topic is waitng for you to dive in!"}
            </p>
          </div>
          <button
            className="w-full h-[48px] rounded-[16px] bg-[#155dfc] text-white font-black text-[12px] uppercase tracking-[1.2px] shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: config.accent }}
          >
            Practice Now <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function WeeklyActivity() {
  const [active, setActive] = useState<"minutes" | "score" | "topics">(
    "minutes",
  );

  const data = weeklyData[active];

  const fillColor =
    active === "minutes"
      ? "#3b82f6"
      : active === "score"
        ? "#10b981"
        : "#8b5cf6";

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl p-8 mb-12 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-black text-[14px] text-[#101828] uppercase tracking-[0.5px]">
            Weekly Activity
          </h3>
          <p className="text-[12px] text-[#6a7282]">
            Your learning patterns this week
          </p>
        </div>

        {/* Tabs */}
        <AnimatedSection className="flex justify-center">
          <div className="inline-flex items-center rounded-2xl bg-gray-100 p-1.5 shadow-inner">
            {tabs.map((t) => (
              <motion.button
                key={t.key}
                onClick={() => setActive(t.key as any)}
                // whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 text-xs   px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active === t.key ? "text-blue-600" : "text-gray-500"
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
                  {t.label}
                </span>
              </motion.button>
            ))}
          </div>
        </AnimatedSection>
        {/* <div className="bg-[#f3f4f6] p-1 rounded-full flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key as any)}
              className={`px-4 py-2 text-[10px] font-black rounded-full transition-all ${
                active === tab.key
                  ? "bg-white text-[#155dfc] shadow"
                  : "text-[#6a7282]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* 🔥 Animate chart switch */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <BarChart data={data} barCategoryGap={30}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />

              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis hide />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="val"
                radius={[12, 12, 0, 0]}
                fill={fillColor}
                animationDuration={800}
                maxBarSize={48}
              />
            </BarChart>
          </motion.div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Reusable animation variants ─────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

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
