import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Plus,
  FileText,
  ClipboardCheck,
  Eye,
  Loader2,
  Clock4,
} from "lucide-react";
import {
  getTeacherHomeworks,
  type TeacherHomework,
} from "@/api/teacherHomework";
import CreateHomeworkModal from "@/components/homework/CreateHomeworkModal";

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-CA");
}

function HomeworkCard({ hw }: { hw: TeacherHomework }) {
  const navigate = useNavigate();
  const isActive = hw.status === "ACTIVE";
  const rate =
    hw.total_students > 0
      ? Math.round((hw.submissions_count / hw.total_students) * 100)
      : 0;

  return (
    <div
      className={`rounded-3xl border shadow-sm px-6 pt-6 pb-0.5 flex flex-col gap-4 ${
        isActive
          ? "bg-white border-gray-100"
          : "bg-[#f9fafb] border-gray-200 opacity-90"
      }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isActive
                ? "bg-linear-to-br from-orange-100 to-rose-100"
                : "bg-linear-to-br from-gray-200 to-gray-300"
            }`}>
            <FileText
              size={18}
              className={isActive ? "text-orange-600" : "text-gray-500"}
            />
          </div>
          <div className="min-w-0">
            <h3
              className={`text-[16px] font-bold truncate ${
                isActive ? "text-[#101828]" : "text-[#364153]"
              }`}>
              {hw.title}
            </h3>
            <p className="text-[12px] text-gray-400 font-medium">
              {hw.class} · {hw.subject}
            </p>
          </div>
        </div>
        <span
          className={`text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-full shrink-0 ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-600"
          }`}>
          {isActive ? "Active" : "Closed"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div
          className={`rounded-2xl px-3 py-3 ${isActive ? "bg-gray-50" : "bg-white"}`}>
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
            Deadline
          </p>
          <p className="text-[14px] font-bold text-[#101828] mt-1">
            {fmtDate(hw.due_date)}
          </p>
        </div>
        <div
          className={`rounded-2xl px-3 py-3 ${isActive ? "bg-violet-50" : "bg-white"}`}>
          <p
            className={`text-[9px] font-black uppercase tracking-wider ${
              isActive ? "text-violet-500" : "text-gray-400"
            }`}>
            Questions
          </p>
          <p
            className={`text-[14px] font-bold mt-1 ${
              isActive ? "text-violet-900" : "text-[#101828]"
            }`}>
            {hw.total_questions}
          </p>
        </div>
        <div
          className={`rounded-2xl px-3 py-3 ${isActive ? "bg-emerald-50" : "bg-white"}`}>
          <p
            className={`text-[9px] font-black uppercase tracking-wider ${
              isActive ? "text-emerald-600" : "text-gray-400"
            }`}>
            Submissions
          </p>
          <p
            className={`text-[14px] font-bold mt-1 ${
              isActive ? "text-emerald-900" : "text-[#101828]"
            }`}>
            {hw.submissions_count}/{hw.total_students}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
            {isActive ? "Submission Rate" : "Final Submission Rate"}
          </span>
          <span className="text-[12px] font-bold text-gray-500">{rate}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              isActive
                ? "bg-linear-to-r from-emerald-500 to-green-400"
                : "bg-linear-to-r from-gray-400 to-gray-500"
            }`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/homework/${hw.id}/submissions`)}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-colors mb-4 ${
          isActive
            ? "bg-[#155dfc] hover:bg-[#0f4bd6] text-white"
            : "bg-[#4a5565] hover:bg-[#364153] text-white"
        }`}>
        {isActive ? <ClipboardCheck size={14} /> : <Eye size={14} />}
        {isActive ? "View Submissions" : "View Results"}
      </button>
    </div>
  );
}

export default function Homework() {
  const [homeworks, setHomeworks] = useState<TeacherHomework[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchHomeworks = () =>
    getTeacherHomeworks()
      .then((res) => setHomeworks(res.homeworks))
      .catch(() => {})
      .finally(() => setLoading(false));

  const refresh = () => {
    setLoading(true);
    fetchHomeworks();
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const active = homeworks.filter((h) => h.status === "ACTIVE");
  const past = homeworks.filter((h) => h.status === "CLOSED");

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen">
      <CreateHomeworkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />
      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-[14px] font-black uppercase tracking-wider text-[#101828]">
              Homework Assignments
            </h1>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">
              {homeworks.length} assignments · {active.length} active
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#155dfc] hover:bg-[#0f4bd6] text-white text-[13px] font-bold px-5 py-3 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(21,93,252,0.2)] transition-colors">
            <Plus size={16} />
            Create Homework
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading homework...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                  <Clock4 size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black uppercase tracking-wider text-[#101828]">
                    Current Homework
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium">
                    {active.length} active assignments
                  </p>
                </div>
              </div>
              {active.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-12 text-center text-gray-400 text-[13px] font-medium">
                  No active homework right now.
                </div>
              ) : (
                active.map((hw) => (
                  <motion.div
                    key={hw.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}>
                    <HomeworkCard hw={hw} />
                  </motion.div>
                ))
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-gray-400 to-gray-500 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black uppercase tracking-wider text-[#101828]">
                    Past Homework
                  </h2>
                  <p className="text-[12px] text-gray-400 font-medium">
                    {past.length} completed assignments
                  </p>
                </div>
              </div>
              {past.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl py-12 text-center text-gray-400 text-[13px] font-medium">
                  No past homework yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {past.map((hw) => (
                    <HomeworkCard key={hw.id} hw={hw} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
