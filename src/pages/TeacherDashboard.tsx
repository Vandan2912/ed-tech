import { useState, useEffect } from "react";
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
import {
  getAlerts,
  sendReminder,
  dismissAlert,
  type Alert,
} from "@/api/alerts";

function formatLastActive(
  dateStr: string | null,
  daysInactive: number | null,
): string {
  if (daysInactive !== null) return `${daysInactive} days since last login`;
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} since last login`;
}

function formatAlertTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} min ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAlerts()
      .then(({ alerts }) => {
        const active = alerts.filter((a) => !a.isDismissed);
        setAlerts(active);
        setRemindedIds(
          new Set(active.filter((a) => a.isReminded).map((a) => a.userId)),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.userId));
  const totalAlerts = visibleAlerts.length;
  const inactiveCount = visibleAlerts.filter(
    (a) => a.type === "inactive",
  ).length;
  const failedTwiceCount = visibleAlerts.filter(
    (a) => a.type === "failed",
  ).length;

  const tabs = [
    { id: "all", label: `All (${totalAlerts})` },
    { id: "inactive", label: `Inactive (${inactiveCount})` },
    { id: "failed", label: `Failed Twice (${failedTwiceCount})` },
  ];

  const filteredAlerts =
    activeFilter === "all"
      ? visibleAlerts
      : visibleAlerts.filter((a) => a.type === activeFilter);

  const handleDismiss = async (alert: Alert) => {
    setDismissingIds((prev) => new Set([...prev, alert.userId]));
    try {
      await dismissAlert({
        studentId: alert.userId,
        alertType: alert.type,
        quizId: alert.quizId,
      });
    } catch {
      // optimistic removal regardless — teacher's intent is clear
    } finally {
      setDismissingIds((prev) => {
        const s = new Set(prev);
        s.delete(alert.userId);
        return s;
      });
      setDismissedIds((prev) => new Set([...prev, alert.userId]));
    }
  };

  const handleRemind = async (alert: Alert) => {
    setSendingIds((prev) => new Set([...prev, alert.userId]));
    try {
      await sendReminder({
        studentId: alert.userId,
        alertType: alert.type,
        quizId: alert.quizId,
      });
      setRemindedIds((prev) => new Set([...prev, alert.userId]));
    } catch {
      // silently fail — button re-enables so teacher can retry
    } finally {
      setSendingIds((prev) => {
        const s = new Set(prev);
        s.delete(alert.userId);
        return s;
      });
    }
  };

  const handleClearAll = () => {
    setDismissedIds(new Set(alerts.map((a) => a.userId)));
  };

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
                {loading
                  ? "Loading alerts..."
                  : totalAlerts === 0
                    ? "All students are on track."
                    : `You have ${totalAlerts} student${totalAlerts !== 1 ? "s" : ""} requiring immediate attention.`}
              </p>
            </div>

            <div className="bg-white/15 border border-white/20 rounded-2xl flex items-center gap-4 px-5 py-3 backdrop-blur-sm">
              <Bell size={24} className="text-white shrink-0" />
              <div>
                <p className="font-black text-base leading-tight">
                  {totalAlerts} Active Alert
                  {totalAlerts !== 1 ? "s" : ""}
                </p>
                <p className="text-blue-200 text-xs">Review and take action</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#fef2f2] border border-[#ffe2e2] rounded-[24px] p-5 h-30.25 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#e7000b] text-[10px] uppercase font-black tracking-widest">
                Total Alerts
              </span>
              <AlertTriangle size={16} className="text-[#e7000b]" />
            </div>
            <div>
              <div className="text-[#82181a] text-3xl font-black tracking-wide leading-none mb-1">
                {loading ? "—" : totalAlerts}
              </div>
              <div className="text-[#fb2c36] text-[10px] font-bold">
                Require attention
              </div>
            </div>
          </div>

          <div className="bg-[#fffbeb] border border-[#fef3c6] rounded-[24px] p-5 h-30.25 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#bb4d00] text-[10px] uppercase font-black tracking-widest">
                Inactive ≥ 3 days
              </span>
              <UserX size={16} className="text-[#bb4d00]" />
            </div>
            <div>
              <div className="text-[#7b3306] text-3xl font-black tracking-wide leading-none mb-1">
                {loading ? "—" : inactiveCount}
              </div>
              <div className="text-[#e17100] text-[10px] font-bold">
                Students offline
              </div>
            </div>
          </div>

          <div className="bg-[#fff7ed] border border-[#ffedd4] rounded-[24px] p-5 h-30.25 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#ca3500] text-[10px] uppercase font-black tracking-widest">
                Failed Twice
              </span>
              <XCircle size={16} className="text-[#ca3500]" />
            </div>
            <div>
              <div className="text-[#7e2a0c] text-3xl font-black tracking-wide leading-none mb-1">
                {loading ? "—" : failedTwiceCount}
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
                }`}>
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

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-[#6a7282] hover:text-[#101828] transition-colors group">
            <FilterX size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Clear All
            </span>
          </button>
        </div>

        {/* Alert List */}
        <div className="space-y-4 mb-16">
          {loading ? (
            <div className="text-center py-16 text-[#99a1af] text-sm font-bold">
              Loading alerts...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-16 text-[#99a1af] text-sm font-bold">
              No alerts to show.
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((alert) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={alert.userId}
                  className={`flex flex-col md:flex-row items-center gap-4 p-5 rounded-[28px] border-2 transition-shadow hover:shadow-md ${
                    alert.type === "inactive"
                      ? "bg-[#fffbeb] border-[#fee685]"
                      : "bg-[#fff7ed] border-[#ffd6a8]"
                  }`}>
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm shrink-0 overflow-hidden">
                    <img
                      src={alert.profilePicture || "/user.svg"}
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
                        }`}>
                        {alert.type === "inactive"
                          ? "⚠ Inactive"
                          : "✗ Failed Twice"}
                      </div>
                      <span className="text-[9px] font-bold text-[#99a1af]">
                        {formatAlertTime(alert.lastActiveDate)}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1.5">
                      <h4 className="text-[14px] font-black text-[#101828]">
                        {alert.studentName}
                      </h4>
                      <span className="text-[12px] font-bold text-[#99a1af]">
                        · Class {alert.class}
                      </span>
                    </div>

                    <p className="text-[#4a5565] text-xs mb-1 truncate">
                      {alert.type === "inactive"
                        ? `Has not logged in for ${alert.daysInactive ?? "several"} days`
                        : `Failed the same topic quiz twice in a row`}
                    </p>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        alert.type === "inactive"
                          ? "text-[#e17100]"
                          : "text-[#f54900]"
                      }`}>
                      {alert.type === "inactive"
                        ? formatLastActive(
                            alert.lastActiveDate,
                            alert.daysInactive,
                          )
                        : alert.quizId
                          ? `TOPIC: ${alert.quizId}`
                          : "QUIZ FAILURE"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRemind(alert)}
                      disabled={
                        remindedIds.has(alert.userId) ||
                        sendingIds.has(alert.userId)
                      }
                      className={`flex items-center justify-center gap-1.5 w-full border rounded-xl px-4 py-2 transition-colors shadow-sm focus-visible:outline-none ${
                        remindedIds.has(alert.userId)
                          ? "bg-green-50 border-green-200 cursor-default"
                          : sendingIds.has(alert.userId)
                            ? "bg-gray-50 border-[#e5e7eb] cursor-wait"
                            : "bg-white border-[#e5e7eb] hover:bg-gray-50"
                      }`}>
                      <Send
                        size={12}
                        className={
                          remindedIds.has(alert.userId)
                            ? "text-green-500"
                            : "text-[#364153]"
                        }
                      />
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          remindedIds.has(alert.userId)
                            ? "text-green-600"
                            : "text-[#364153]"
                        }`}>
                        {sendingIds.has(alert.userId)
                          ? "Sending..."
                          : remindedIds.has(alert.userId)
                            ? "Reminded"
                            : "Remind"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDismiss(alert)}
                      disabled={dismissingIds.has(alert.userId)}
                      className={`flex items-center justify-center gap-1.5 w-full bg-white border border-[#e5e7eb] rounded-xl px-4 py-2 transition-colors focus-visible:outline-none ${
                        dismissingIds.has(alert.userId)
                          ? "cursor-wait opacity-60"
                          : "hover:bg-gray-50"
                      }`}>
                      <X size={12} className="text-[#6a7282]" />
                      <span className="text-[#6a7282] text-[9px] font-black uppercase tracking-wider">
                        {dismissingIds.has(alert.userId) ? "..." : "Dismiss"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
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
