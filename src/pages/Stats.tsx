import { motion } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Activity,
  History,
  BookOpen,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const historicalData = [
  { name: "Algebra", load: 2400, pressure: 2400 },
  { name: "Geometry", load: 1398, pressure: 2210 },
  { name: "History", load: 9800, pressure: 2290 },
  { name: "Chemicals", load: 3908, pressure: 2000 },
];

export default function Stats() {
  const errorPatterns = [
    {
      subject: "Algebra Basics",
      description: "Sign inversion in equations",
      status: "improving",
      statusColor: "bg-[#FE9A00]",
      occurrences: 3,
      iconColor: "bg-[#FEF3C6]",
      icon: <Brain className="size-6 text-[#92400E]" />,
    },
    {
      subject: "Laws of Motion",
      description: "Confusing Velocity with Acceleration",
      status: "critical",
      statusColor: "bg-[#FB2C36]",
      occurrences: 2,
      iconColor: "bg-[#FFE2E2]",
      icon: <AlertCircle className="size-6 text-[#991B1B]" />,
    },
    {
      subject: "Cell Biology",
      description: "Organelle function mismatch",
      status: "fixed",
      statusColor: "bg-[#00C950]",
      occurrences: 4,
      iconColor: "bg-[#DCFCE7]",
      icon: <CheckCircle2 className="size-6 text-[#166534]" />,
    },
  ];

  const subjects = [
    { name: "Science", progress: 75 },
    { name: "Math", progress: 75 },
    { name: "History", progress: 75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f9fafb] min-h-screen font-['Inter'] pb-20"
    >
      <div className="max-w-[1129px] mx-auto px-4 md:px-8 pt-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-[#101828] text-[30px] font-black tracking-[0.4px]">
              Learning Analytics
            </h1>
            <p className="text-[#6a7282] text-[16px]">
              AI-driven insights into your study patterns
            </p>
          </div>

          <div className="bg-[#ecfdf5] border border-[#d0fae5] rounded-[16px] px-4 py-3 flex items-center gap-3">
            <div className="size-5 text-[#009966]">
              <Target />
            </div>
            <div className="flex flex-col">
              <span className="text-[#009966] text-[10px] font-black uppercase tracking-[1.1px]">
                Correction Streak
              </span>
              <span className="text-[#004f3b] text-[14px] font-black">
                4 Misconceptions Fixed
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Error Analysis */}
          <div className="lg:col-span-2 bg-white border border-[#f3f4f6] rounded-[40px] shadow-xl overflow-hidden flex flex-col">
            <div className="bg-linear-to-r from-[rgba(254,242,242,0.3)] to-white border-b border-[#f9fafb] p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#ffe2e2] p-2.5 rounded-[14px]">
                  <Activity className="size-6 text-[#fb2c36]" />
                </div>
                <h3 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.55px]">
                  AI Error Pattern Analysis
                </h3>
              </div>
              <span className="bg-[#fef2f2] text-[#fb2c36] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1px]">
                3 Active Patterns
              </span>
            </div>

            <div className="p-8 space-y-6">
              {errorPatterns.map((pattern, idx) => (
                <div
                  key={idx}
                  className="border border-[#f9fafb] rounded-[24px] p-5 flex items-start gap-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className={`${pattern.iconColor} p-3 rounded-[16px]`}>
                    {pattern.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[#101828] text-[16px] font-bold">
                        {pattern.subject}
                      </h4>
                      <span
                        className={`${pattern.statusColor} text-white text-[8px] font-black px-2 py-0.5 rounded-[8px] uppercase tracking-[1px]`}
                      >
                        {pattern.status}
                      </span>
                    </div>
                    <p className="text-[#6a7282] text-[12px]">
                      {pattern.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-2">
                      <History className="size-3 text-[#99a1af]" />
                      <span className="text-[#99a1af] text-[10px] font-bold">
                        {pattern.occurrences} occurrences
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Points & Distribution */}
          <div className="space-y-8">
            {/* Misconception Points */}
            <div className="bg-[#101828] text-white rounded-[40px] p-8 relative overflow-hidden shadow-2xl h-[300px] flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 size-32 bg-blue-500/10 blur-3xl" />
              <div className="flex items-center gap-2 opacity-70 mb-4 self-start">
                <TrendingUp className="size-4" />
                <span className="text-[12px] font-black uppercase tracking-[1.2px]">
                  Misconception Points
                </span>
              </div>
              <h2 className="text-[48px] font-black tracking-[0.35px] mb-2">
                525
              </h2>
              <span className="text-[#8ec5ff] text-[10px] font-black uppercase tracking-[2.1px]">
                Bonus XP Earned
              </span>

              <div className="mt-8 bg-white/5 border border-white/10 rounded-[24px] p-4 text-[12px] leading-relaxed">
                <span className="text-[#99a1af]">
                  Fixing a mistake earns you{" "}
                </span>
                <span className="font-bold text-white">1.5x more XP</span>
                <span className="text-[#99a1af]">
                  {" "}
                  than a first-time correct answer.
                </span>
              </div>
            </div>

            {/* Error Distribution */}
            <div className="bg-white border border-[#f3f4f6] rounded-[40px] p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <PieChart className="size-4 text-[#99a1af]" />
                <h3 className="text-[#99a1af] text-[12px] font-black uppercase tracking-[1.2px]">
                  Error Distribution
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Misinterpretation",
                    value: 45,
                    color: "bg-[#2b7fff]",
                  },
                  {
                    label: "Calculation Error",
                    value: 30,
                    color: "bg-[#ad46ff]",
                  },
                  { label: "Logical Gap", value: 25, color: "bg-[#ff6467]" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[1.1px]">
                      <span className="text-[#6a7282]">{item.label}</span>
                      <span className="text-[#101828]">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress by Subject */}
          <div className="bg-white border border-[#f3f4f6] rounded-[40px] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="size-5 text-[#101828]" />
              <h3 className="text-[#101828] text-[18px] font-bold tracking-tight">
                Progress by Subject
              </h3>
            </div>
            <div className="space-y-6">
              {subjects.map((sub, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#101828] text-[14px] font-bold">
                      {sub.name}
                    </span>
                    <span className="text-[#155dfc] text-[14px] font-bold">
                      {sub.progress}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-[#f3f4f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#155dfc] rounded-full"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-[#101828] text-white rounded-[40px] p-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 size-40 bg-purple-600/20 blur-3xl" />
            <div className="flex items-center gap-3 mb-8">
              <Activity className="size-5 text-white" />
              <h3 className="text-white text-[18px] font-bold tracking-tight">
                Key Metrics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 space-y-1">
                <span className="text-[30px] font-black">42h</span>
                <p className="text-[#6a7282] text-[12px] font-black uppercase tracking-[1.2px]">
                  Study Time
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 space-y-1">
                <span className="text-[30px] font-black">92%</span>
                <p className="text-[#6a7282] text-[12px] font-black uppercase tracking-[1.2px]">
                  Accuracy
                </p>
              </div>
            </div>

            <div className="mt-8 bg-[#155dfc] rounded-[24px] p-6 flex items-center gap-4">
              <div className="p-2.5 bg-white/20 rounded-full">
                <Lightbulb className="size-6 text-white" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white">
                  Cognitive Peak
                </h4>
                <p className="text-[#dbeafe] text-[12px]">
                  You learn best at 10:00 AM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Analysis */}
        <div className="space-y-8">
          <h2 className="text-[#101828] text-[24px] font-bold">
            Historical Load Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-[#f3f4f6] rounded-[40px] p-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div className="space-y-1">
                  <span className="text-[#155dfc] text-[12px] font-black uppercase tracking-[1.2px]">
                    Live Metrics
                  </span>
                  <h4 className="text-[#101828] text-[16px] font-bold">
                    Engagement vs. Stress
                  </h4>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-[#2b7fff]" />
                    <span className="text-[#6a7282] text-[10px] font-black uppercase tracking-[0.1px]">
                      Load
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-[#c27aff]" />
                    <span className="text-[#6a7282] text-[10px] font-black uppercase tracking-[0.1px]">
                      Pressure
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[256px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient
                        id="colorLoad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2b7fff"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2b7fff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#9ca3af",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="load"
                      stroke="#2b7fff"
                      fillOpacity={1}
                      fill="url(#colorLoad)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="pressure"
                      stroke="#c27aff"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric Guide */}
            <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-[40px] p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="size-5 text-[#101828]" />
                <h4 className="text-[#101828] text-[16px] font-bold">
                  Metric Guide
                </h4>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Optimal Zone (Flow)",
                    range: "30% - 65%",
                    color: "bg-[#00C950]",
                    text: "Perfect balance between challenge and skill. Maximum retention happens here.",
                  },
                  {
                    label: "Intensive Learning",
                    range: "65% - 85%",
                    color: "bg-[#FE9A00]",
                    text: "Highly focused but exhausting. Recommended for short sessions only.",
                  },
                  {
                    label: "Cognitive Overload",
                    range: "85%+",
                    color: "bg-[#fb2c36]",
                    text: "Information saturation reached. Take a 15-minute break immediately.",
                  },
                ].map((guide, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-100 rounded-[16px] p-4 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full ${guide.color}`} />
                      <span className="text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1px]">
                        {guide.range}
                      </span>
                    </div>
                    <h5 className="text-[#101828] text-[14px] font-bold">
                      {guide.label}
                    </h5>
                    <p className="text-[#6a7282] text-[10px] leading-relaxed">
                      {guide.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto bg-[#155dfc] text-white rounded-[24px] p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Brain className="size-5" />
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-[1.1px]">
                    AI Suggestion
                  </span>
                </div>
                <p className="text-[12px] font-bold">
                  Your "History" load is low. Try increasing difficulty for
                  better engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-[#155dfc] size-16 rounded-full shadow-[0_25px_50px_0_#bedbff] flex items-center justify-center relative group hover:scale-105 transition-transform">
          <Activity className="size-7 text-white" />
          <div className="absolute -top-1 -right-1 bg-[#00c950] border-2 border-white size-5 rounded-full flex items-center justify-center">
            <Brain className="size-2.5 text-white" />
          </div>
        </button>
      </div>
    </motion.div>
  );
}
