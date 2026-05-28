import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth/useAuth";
import { Pin, Send, Loader2 } from "lucide-react";
import {
  getPinnedMessages,
  notifyNotificationsUpdated,
  pinMessage,
  type PinnedMessage,
} from "@/api/notifications";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PinMessage() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pinned, setPinned] = useState<PinnedMessage | null>(null);
  const [loadingPinned, setLoadingPinned] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && message.trim().length > 0,
    [title, message],
  );

  const refreshPinned = async () => {
    try {
      const list = await getPinnedMessages();
      setPinned(list[0] ?? null);
    } catch (err) {
      console.error("Failed to load pinned messages", err);
    } finally {
      setLoadingPinned(false);
    }
  };

  useEffect(() => {
    refreshPinned();
  }, []);

  const handlePin = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      await pinMessage({
        title: title.trim(),
        message: message.trim(),
      });
      toast.success("Message pinned for all students");
      setTitle("");
      setMessage("");
      notifyNotificationsUpdated();
      await refreshPinned();
    } catch (err) {
      console.error("Failed to pin message", err);
      toast.error("Couldn't pin your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen">
      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#4f39f6] to-[#1447e6] rounded-[32px] p-8 md:p-10 relative overflow-hidden text-white">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tight">
                Welcome back, {user?.first_name || "Teacher"}!
              </h1>
              <p className="text-blue-100 text-base">
                Pin a text message for all your connected students.
              </p>
            </div>
          </div>
        </div>

        {/* Currently Pinned / Empty State */}
        {loadingPinned ? (
          <div className="bg-white border border-[#f3f4f6] rounded-[28px] py-8 flex items-center justify-center gap-2 text-[#99a1af] text-[12px]">
            <Loader2 size={14} className="animate-spin" />
            Loading pinned message...
          </div>
        ) : pinned ? (
          <div className="bg-linear-to-r from-[#eff6ff] to-white border border-[#dbeafe] rounded-[28px] p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="bg-[#dbeafe] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                <Pin size={20} className="text-[#1447e6]" fill="#1447e6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#1447e6] text-white text-[9px] font-black uppercase tracking-[1.12px] rounded-full px-2 py-0.5">
                    Currently Pinned
                  </span>
                  <span className="text-[#6a7282] text-[10px] font-bold tracking-[0.17px]">
                    {formatDate(pinned.createdAt)}
                  </span>
                </div>
                <h3 className="text-[#101828] text-[16px] font-black tracking-[-0.15px] mb-1.5">
                  {pinned.title}
                </h3>
                <p className="text-[#374151] text-[13px] leading-5 whitespace-pre-wrap">
                  {pinned.message}
                </p>
                <p className="text-[#99a1af] text-[10px] font-black uppercase tracking-[1.12px] mt-3">
                  Pinned by {pinned.teacherName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#f9fafb] border-2 border-[#e5e7eb] border-dashed rounded-[28px] py-8 flex flex-col items-center justify-center text-center">
            <Pin size={32} className="text-[#d1d5db] mb-4" />
            <h3 className="text-[#99a1af] text-[14px] font-bold tracking-[-0.1504px] mb-1">
              No message currently pinned
            </h3>
            <p className="text-[#99a1af] text-[12px]">
              Pin a text message for all students to see
            </p>
          </div>
        )}

        {/* Create Pinned Message Card */}
        <div className="bg-white border border-[#f3f4f6] shadow-sm rounded-[28px] p-6">
          <div className="mb-5">
            <h2 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.5496px]">
              Create Pinned Message
            </h2>
            <p className="text-[#6a7282] text-[12px]">
              Visible to all students connected to your class
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                Message Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Important: Revision for Unit 3 Test"
                className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold"
              />
            </div>
            <div>
              <label className="block text-[#99a1af] text-[10px] font-black uppercase tracking-[1.1172px] mb-2 px-1">
                Message Content *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to students..."
                rows={6}
                className="w-full bg-[#f9fafb] border border-[#f3f4f6] text-[#101828] font-bold text-[16px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 placeholder:text-[rgba(16,24,40,0.5)] placeholder:font-bold resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePin}
              disabled={!canSubmit || submitting}
              className="w-full bg-[#4f39f6] text-white h-13 rounded-2xl font-black text-[14px] uppercase tracking-[1.2496px] shadow-[0_20px_25px_0_#c6d2ff,0_8px_10px_0_#c6d2ff] flex items-center justify-center gap-2 hover:bg-[#3d24e5] transition-colors focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Pinning...
                </>
              ) : (
                <>
                  <Pin size={16} fill="white" />
                  Pin for All Students
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-[28px] p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Send size={16} className="text-[#1c398e]" />
            <h4 className="text-[#1c398e] text-[14px] font-black uppercase tracking-[0.5496px]">
              How Pinned Messages Work
            </h4>
          </div>
          <ul className="space-y-2.5">
            {[
              "Pinned messages appear as a banner at the top of every student's dashboard",
              "Students can dismiss the message but it remains accessible",
              "Only one message can be pinned at a time — pinning a new one replaces the old",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="bg-[#2b7fff] w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" />
                <span className="text-[#1447e6] text-[12px]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
