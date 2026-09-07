import { useEffect, useState } from "react";
import { Check, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type RowStatus = "done" | "active" | "pending";

function ChecklistRow({
  title,
  subtitle,
  status,
  percent,
}: {
  title: string;
  subtitle: string;
  status: RowStatus;
  percent?: number;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 items-center p-5 rounded-2xl border w-full transition-colors",
        status === "active"
          ? "bg-[#eff6ff] border-[#3eaef0]/40 ring-2 ring-[#3eaef0]/20 shadow-[0px_8px_10px_rgba(0,0,0,0.04)]"
          : "bg-white border-[#e5e7eb] shadow-[0px_4px_6px_rgba(0,0,0,0.03)]",
      )}>
      <div
        className={cn(
          "flex items-center justify-center shrink-0 size-10 rounded-full",
          status === "done" && "bg-[#ecfdf5]",
          status === "active" && "bg-[#dbeafe]",
          status === "pending" && "bg-[#f3f4f6]",
        )}>
        {status === "done" && <Check size={20} className="text-[#10b981]" />}
        {status === "active" && (
          <Loader2 size={20} className="text-[#3eaef0] animate-spin" />
        )}
        {status === "pending" && (
          <Clock size={20} className="text-[#9ca3af]" />
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-[16px] font-semibold text-[#111827]">{title}</p>
        <p className="text-[14px] text-[#6b7280]">{subtitle}</p>
      </div>
      <div
        className={cn(
          "px-3 py-1.5 rounded-xl text-xs font-bold shrink-0",
          status === "done" && "bg-[#ecfdf5] text-[#10b981]",
          status === "active" && "bg-[#cfebfb] text-[#0f80c3]",
          status === "pending" && "bg-[#f3f4f6] text-[#9ca3af]",
        )}>
        {status === "done"
          ? "Done"
          : status === "active"
            ? `${percent ?? 0}%`
            : "Pending"}
      </div>
    </div>
  );
}

export function ProcessingChecklist({
  subjectCount,
  onComplete,
}: {
  subjectCount: number;
  onComplete: () => void;
}) {
  const [percent, setPercent] = useState(0);
  const [finalizing, setFinalizing] = useState<RowStatus>("active");
  const [ready, setReady] = useState<RowStatus>("pending");

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setPercent(pct);
      if (pct >= 100) {
        clearInterval(tick);
        setFinalizing("done");
        setReady("active");
        setTimeout(() => {
          setReady("done");
          setTimeout(onComplete, 500);
        }, 600);
      }
    }, 60);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <ChecklistRow
        title="Account Created"
        subtitle="Email verified & password set"
        status="done"
      />
      <ChecklistRow
        title="Personal Details Saved"
        subtitle="Name, DOB & contact info confirmed"
        status="done"
      />
      <ChecklistRow
        title="Subjects Selected"
        subtitle={`${subjectCount} subject${subjectCount === 1 ? "" : "s"} added to your curriculum`}
        status="done"
      />
      <ChecklistRow
        title="Finalizing Profile"
        subtitle="Configuring your dashboard & recommendations"
        status={finalizing}
        percent={percent}
      />
      <ChecklistRow
        title="Ready to Learn!"
        subtitle="Your personalized dashboard awaits"
        status={ready}
      />
    </div>
  );
}
