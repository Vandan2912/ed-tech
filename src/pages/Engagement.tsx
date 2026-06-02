import { useState, useEffect } from "react";
import { useAuth } from "@/auth/useAuth";
import {
  Search,
  Users,
  CheckCircle,
  AlertTriangle,
  BarChart as BarChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getEngagementDashboard, type EngagementData } from "@/api/engagement";

function formatLastActive(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

export default function Engagement() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "AT RISK">("ALL");
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEngagementDashboard()
      .then(setData)
      .catch(() => setError("Failed to load engagement data."))
      .finally(() => setLoading(false));
  }, []);

  const students = data?.students ?? [];
  const summary = data?.summary;
  const weeklyData = data?.weeklyEngagement ?? [];
  const performanceData = (data?.subjectPerformance ?? []).map((sp) => ({
    subject: sp.subjectName,
    top: sp.topScore,
    average: sp.avgScore,
    bottom: sp.bottomScore,
  }));

  const filteredStudents = students.filter(
    (s) =>
      (filter === "ALL" ||
        (filter === "ACTIVE" && s.status === "active") ||
        (filter === "AT RISK" && ["high", "critical"].includes(s.riskLevel))) &&
      s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const engagementPct =
    summary && summary.totalStudents > 0
      ? Math.round((summary.activeToday / summary.totalStudents) * 100)
      : 0;

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen font-['Inter']">
      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-282.25 mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#4f39f6] to-[#1447e6] rounded-[32px] p-8 md:p-10 relative overflow-hidden text-white shadow-sm">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">
                Welcome back, {user?.first_name || "Teacher"}!
              </h1>
              <p className="text-blue-100 text-[16px]">
                Monitor your students' progress and identify who needs extra
                support.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-[#6a7282]">
            Loading engagement data…
          </div>
        )}

        {error && (
          <div className="bg-[#fef2f2] border border-[#ffe2e2] rounded-2xl p-6 text-[#e7000b] text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Students"
                value={String(summary?.totalStudents ?? 0)}
                subtitle="In your class"
                icon={Users}
                iconColor="text-[#99a1af]"
                valueColor="text-[#101828]"
                bgClasses="bg-white border-[#f3f4f6]"
              />
              <MetricCard
                title="Active Today"
                value={String(summary?.activeToday ?? 0)}
                subtitle={`${engagementPct}% engagement`}
                icon={CheckCircle}
                iconColor="text-[#009966]"
                valueColor="text-[#004f3b]"
                bgClasses="bg-[#ecfdf5] border-[#d0fae5]"
                titleColor="text-[#009966]"
              />
              <MetricCard
                title="At Risk"
                value={String(summary?.atRisk ?? 0)}
                subtitle="Need attention"
                icon={AlertTriangle}
                iconColor="text-[#e7000b]"
                valueColor="text-[#82181a]"
                bgClasses="bg-[#fef2f2] border-[#ffe2e2]"
                titleColor="text-[#e7000b]"
              />
              <MetricCard
                title="Avg Score"
                value={`${summary?.avgScore ?? 0}%`}
                subtitle="Class average"
                icon={BarChartIcon}
                iconColor="text-[#155dfc]"
                valueColor="text-[#1c398e]"
                bgClasses="bg-[#eff6ff] border-[#dbeafe]"
                titleColor="text-[#155dfc]"
              />
            </div>

            {/* Weekly Engagement Chart */}
            <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-8">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.55px]">
                    Weekly Engagement
                  </h3>
                  <p className="text-[#6a7282] text-[12px] mt-1">
                    Active vs Inactive students per day
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00bc7d]"></div>
                    <span className="text-[#0a0a0a] text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff6467]"></div>
                    <span className="text-[#0a0a0a] text-[10px] font-bold">
                      Inactive
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barSize={24} barGap={8}>
                    <CartesianGrid
                      vertical={false}
                      stroke="#E5E7EB"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#9ca3af",
                        fontSize: 11,
                        fontWeight: "bold",
                      }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: "rgba(229,231,235,0.4)" }}
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar
                      dataKey="active"
                      fill="#00bc7d"
                      radius={[8, 8, 8, 8]}
                    />
                    <Bar
                      dataKey="inactive"
                      fill="#ff6467"
                      radius={[8, 8, 8, 8]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Student Roster Table */}
            <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="border-b border-[#f9fafb] px-8 py-5 flex flex-col md:flex-row justify-between gap-4 items-center">
                <h3 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.55px]">
                  Student Roster
                </h3>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-[#f9fafb] border border-[#f3f4f6] rounded-xl text-sm w-full md:w-55 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="bg-[#f3f4f6] p-1 flex rounded-[14px]">
                    {["ALL", "ACTIVE", "AT RISK"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setFilter(tab as typeof filter)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[1.1px] rounded-[10px] transition-all ${
                          filter === tab
                            ? "bg-white text-[#155dfc] shadow-sm"
                            : "text-[#6a7282] hover:bg-gray-200"
                        }`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#f9fafb]">
                      <th className="px-8 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Student
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Last Active
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Streak
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Avg Score
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Time
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-[#99a1af] uppercase tracking-[1.1px]">
                        Risk Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f9fafb]">
                    {filteredStudents.map((s, idx) => (
                      <tr
                        key={s.userId}
                        className={`hover:bg-gray-50/50 transition-colors ${idx % 2 === 1 ? "bg-[rgba(255,251,235,0.3)]" : ""}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                s.profilePicture ??
                                `https://i.pravatar.cc/150?u=${s.userId}`
                              }
                              alt={s.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#f3f4f6]"
                            />
                            <div>
                              <p className="text-[#101828] text-[14px] font-bold">
                                {s.name}
                              </p>
                              <p className="text-[#99a1af] text-[10px]">
                                Class {s.class}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[1.06px] ${
                              s.status === "active"
                                ? "bg-[#d0fae5] text-[#096]"
                                : "bg-[#f3f4f6] text-[#6a7282]"
                            }`}>
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${s.status === "active" ? "bg-[#00bc7d]" : "bg-[#99a1af]"}`}
                            />
                            {s.status === "active" ? "Active" : "Inactive"}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-[#6a7282] text-[14px] font-normal">
                          {formatLastActive(s.lastActiveDate)}
                        </td>
                        <td className="px-4 py-5 text-[#101828] text-[14px] font-bold">
                          {s.streak}d
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`text-[14px] font-black ${s.status === "active" ? "text-[#096]" : "text-[#e17100]"}`}>
                            {s.avgScore}%
                          </span>
                        </td>
                        <td className="px-4 py-5 text-[#364153] text-[14px] font-bold">
                          {s.timeHours}h
                        </td>
                        <td className="px-8 py-5">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[1.06px] text-white ${
                              s.riskLevel === "low"
                                ? "bg-[#81c784]"
                                : s.riskLevel === "medium"
                                  ? "bg-[#64b5f6]"
                                  : s.riskLevel === "high"
                                    ? "bg-[#ffb900]"
                                    : "bg-[#fb2c36]"
                            }`}>
                            {s.riskLevel}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    No students found matching filters.
                  </div>
                )}
              </div>
            </div>

            {/* Class Performance Chart */}
            {performanceData.length > 0 && (
              <div className="bg-white border border-[#f3f4f6] rounded-[40px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.55px]">
                      Class Performance By Subject
                    </h3>
                    <p className="text-[#6a7282] text-[12px] mt-1">
                      Average, top, and bottom scores
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4f39f6]"></div>
                      <span className="text-[#0a0a0a] text-[10px] font-bold">
                        Top Score
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00bc7d]"></div>
                      <span className="text-[#0a0a0a] text-[10px] font-bold">
                        Average
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff6467]"></div>
                      <span className="text-[#0a0a0a] text-[10px] font-bold">
                        Bottom Score
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-70 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} barSize={20} barGap={12}>
                      <CartesianGrid
                        vertical={false}
                        stroke="#E5E7EB"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="subject"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#9ca3af",
                          fontSize: 11,
                          fontWeight: "bold",
                        }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: "rgba(229,231,235,0.4)" }}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Bar
                        dataKey="top"
                        name="Top Score"
                        fill="#4f39f6"
                        radius={[6, 6, 6, 6]}
                      />
                      <Bar
                        dataKey="average"
                        name="Average"
                        fill="#00bc7d"
                        radius={[6, 6, 6, 6]}
                      />
                      <Bar
                        dataKey="bottom"
                        name="Bottom Score"
                        fill="#ff6467"
                        radius={[6, 6, 6, 6]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  valueColor,
  bgClasses,
  titleColor = "text-[#99a1af]",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  valueColor: string;
  bgClasses: string;
  titleColor?: string;
}) {
  return (
    <div
      className={`p-6 rounded-[24px] border ${bgClasses} shadow-sm flex flex-col justify-between h-33.25`}>
      <div className="flex justify-between items-start">
        <h4
          className={`text-[10px] font-black uppercase tracking-[1.1px] ${titleColor}`}>
          {title}
        </h4>
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <div
          className={`text-[30px] font-black leading-none mb-1 ${valueColor}`}>
          {value}
        </div>
        <p className={`text-[10px] font-bold ${titleColor} opacity-90`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
