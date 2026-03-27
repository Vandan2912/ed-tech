import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/auth/useAuth";
import {
  Bell,
  AlertTriangle,
  UserX,
  XCircle,
  FilterX,
  Send,
  X,
  BrainCircuit,
} from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const alerts = [
    {
      id: 1,
      type: "inactive",
      time: "Just now",
      studentName: "Priya Sharma",
      grade: "9th Grade",
      desc: "Has not logged in for 5 days",
      highlight: "5 days since last login",
      avatar: "https://i.pravatar.cc/150?u=priya",
    },
    {
      id: 2,
      type: "inactive",
      time: "2 hours ago",
      studentName: "Neha Singh",
      grade: "9th Grade",
      desc: "Has not logged in for 7 days",
      highlight: "7 days since last login",
      avatar: "https://i.pravatar.cc/150?u=neha",
    },
    {
      id: 3,
      type: "inactive",
      time: "4 hours ago",
      studentName: "Rohan Gupta",
      grade: "9th Grade",
      desc: "Has not logged in for 3 days",
      highlight: "3 days since last login",
      avatar: "https://i.pravatar.cc/150?u=rohan",
    },
    {
      id: 4,
      type: "failed",
      time: "Yesterday",
      studentName: "Rohan Gupta",
      grade: "9th Grade",
      desc: "Failed 'Laws of Motion' quiz twice in a row",
      highlight: "TOPIC: LAWS OF MOTION",
      avatar: "https://i.pravatar.cc/150?u=rohan",
    },
    {
      id: 5,
      type: "failed",
      time: "2 days ago",
      studentName: "Priya Sharma",
      grade: "9th Grade",
      desc: "Failed 'Organic Chemistry' quiz twice",
      highlight: "TOPIC: ORGANIC CHEMISTRY",
      avatar: "https://i.pravatar.cc/150?u=priya",
    },
  ];

  const tabs = [
    { id: "all", label: "All (5)" },
    { id: "inactive", label: "Inactive (3)" },
    { id: "failed", label: "Failed Twice (2)" },
  ];

  const filteredAlerts = activeFilter === "all" 
    ? alerts 
    : alerts.filter(a => a.type === activeFilter);

  return (
    <div className="bg-[#f9fafb] w-full">
      <div className="min-h-screen bg-[#f9fafb] pt-10 pb-24 relative px-4 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#4f39f6] to-[#1447e6] rounded-[32px] p-8 md:p-10 mb-10 relative overflow-hidden text-white">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">
                Welcome back, {user?.first_name || "Teacher"}!
              </h1>
              <p className="text-blue-100 text-base">
                You have 5 students requiring immediate attention.
              </p>
            </div>

            <div className="bg-white/15 border border-white/20 rounded-2xl flex items-center gap-4 px-5 py-3 backdrop-blur-sm">
              <Bell size={24} className="text-white shrink-0" />
              <div>
                <p className="font-black text-base leading-tight">
                  5 Active Alerts
                </p>
                <p className="text-blue-200 text-xs">Review and take action</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Alerts */}
          <div className="bg-[#fef2f2] border border-[#ffe2e2] rounded-[24px] p-5 h-[121px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#e7000b] text-[10px] uppercase font-black tracking-widest">
                Total Alerts
              </span>
              <AlertTriangle size={16} className="text-[#e7000b]" />
            </div>
            <div>
              <div className="text-[#82181a] text-3xl font-black tracking-wide leading-none mb-1">
                5
              </div>
              <div className="text-[#fb2c36] text-[10px] font-bold">
                Require attention
              </div>
            </div>
          </div>

          {/* Inactive >= 3 days */}
          <div className="bg-[#fffbeb] border border-[#fef3c6] rounded-[24px] p-5 h-[121px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#bb4d00] text-[10px] uppercase font-black tracking-widest">
                Inactive ≥ 3 days
              </span>
              <UserX size={16} className="text-[#bb4d00]" />
            </div>
            <div>
              <div className="text-[#7b3306] text-3xl font-black tracking-wide leading-none mb-1">
                3
              </div>
              <div className="text-[#e17100] text-[10px] font-bold">
                Students offline
              </div>
            </div>
          </div>

          {/* Failed Twice */}
          <div className="bg-[#fff7ed] border border-[#ffedd4] rounded-[24px] p-5 h-[121px] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#ca3500] text-[10px] uppercase font-black tracking-widest">
                Failed Twice
              </span>
              <XCircle size={16} className="text-[#ca3500]" />
            </div>
            <div>
              <div className="text-[#7e2a0c] text-3xl font-black tracking-wide leading-none mb-1">
                2
              </div>
              <div className="text-[#f54900] text-[10px] font-bold">
                Topic failures
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-auto bg-[#f3f4f6] p-1.5 rounded-[16px] flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeFilter === tab.id
                    ? "text-[#e7000b]"
                    : "text-[#6a7282] hover:bg-[rgba(255,255,255,0.5)]"
                }`}
              >
                {activeFilter === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 text-[#6a7282] hover:text-[#101828] transition-colors group">
            <FilterX size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Clear All
            </span>
          </button>
        </div>

        {/* Alert List */}
        <div className="space-y-4 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={alert.id}
                className={`flex flex-col md:flex-row items-center gap-4 p-5 rounded-[28px] border-2 transition-shadow hover:shadow-md ${
                alert.type === "inactive"
                  ? "bg-[#fffbeb] border-[#fee685]"
                  : "bg-[#fff7ed] border-[#ffd6a8]"
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm shrink-0 overflow-hidden">
                <img
                  src={alert.avatar}
                  alt={alert.studentName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${
                      alert.type === "inactive"
                        ? "bg-[#fe9a00]"
                        : "bg-[#ff6900]"
                    }`}
                  >
                    {alert.type === "inactive"
                      ? "⚠ Inactive"
                      : "✗ Failed Twice"}
                  </div>
                  <span className="text-[9px] font-bold text-[#99a1af]">
                    {alert.time}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1.5">
                  <h4 className="text-[14px] font-black text-[#101828]">
                    {alert.studentName}
                  </h4>
                  <span className="text-[12px] font-bold text-[#99a1af]">
                    · {alert.grade}
                  </span>
                </div>

                <p className="text-[#4a5565] text-xs mb-1 truncate">
                  {alert.desc}
                </p>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    alert.type === "inactive"
                      ? "text-[#e17100]"
                      : "text-[#f54900]"
                  }`}
                >
                  {alert.highlight}
                </p>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center gap-2 shrink-0">
                <button className="flex items-center justify-center gap-1.5 w-full bg-white border border-[#e5e7eb] rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm focus-visible:outline-none">
                  <Send size={12} className="text-[#364153]" />
                  <span className="text-[#364153] text-[9px] font-black uppercase tracking-wider">
                    Remind
                  </span>
                </button>
                <button className="flex items-center justify-center gap-1.5 w-full bg-white border border-[#e5e7eb] rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors focus-visible:outline-none">
                  <X size={12} className="text-[#6a7282]" />
                  <span className="text-[#6a7282] text-[9px] font-black uppercase tracking-wider">
                    Dismiss
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* AI Alert Engine Block */}
        <div className="bg-[#101828] rounded-[28px] p-6 overflow-hidden shadow-xl sticky bottom-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#155dfc]/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex items-start sm:items-center gap-4">
            <div className="bg-[#2b7fff]/20 p-2.5 rounded-2xl shrink-0">
              <BrainCircuit size={20} className="text-blue-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-black uppercase tracking-widest mb-1.5">
                AI Alert Engine
              </h4>
              <p className="text-[#99a1af] text-xs leading-relaxed max-w-4xl">
                SmartLearn AI automatically monitors student activity. Alerts
                fire when a student hasn't logged in for 3+ days or fails the
                same topic quiz twice. Send an instant reminder with one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
