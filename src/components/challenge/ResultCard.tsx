import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Full-width result card shared by "Attempt Failed!" (Figma 1669:3563) and
 * "Hurray!" (Figma 1669:3487).
 */
export function ResultCard({
  tone,
  title,
  message,
  children,
  primary,
  secondary,
}: {
  tone: "success" | "error";
  title: string;
  message: string;
  children?: React.ReactNode;
  primary: {
    label: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  };
  secondary: { label: string; onClick: () => void };
}) {
  const success = tone === "success";
  return (
    <div className="flex flex-col items-center gap-9 w-full max-w-[880px] rounded-[22px] border border-[#333]/10 bg-white p-6 sm:p-[60px] shadow-[0px_16px_32px_0px_rgba(88,92,95,0.1)]">
      <span
        className={cn(
          "flex items-center justify-center size-24 rounded-full",
          success ? "bg-[#1fc16b]/10" : "bg-[#ef4444]/10",
        )}>
        <span
          className={cn(
            "flex items-center justify-center size-16 rounded-full",
            success ? "bg-[#1fc16b]" : "bg-[#fb3748]",
          )}>
          {success ? (
            <Check size={28} strokeWidth={3} className="text-white" />
          ) : (
            <X size={29} strokeWidth={3} className="text-white" />
          )}
        </span>
      </span>

      <div className="flex flex-col items-center gap-3 w-full text-center">
        <h1
          className={cn(
            "text-[28px] sm:text-[36px] leading-[44px] font-extrabold",
            success ? "text-[var(--auth-primary-dark-3)]" : "text-[#ef4444]",
          )}>
          {title}
        </h1>
        <p className="text-[16px] sm:text-[18px] leading-[26px] font-medium text-[#777]">
          {message}
        </p>
        {children}
      </div>

      <span className="h-px w-full bg-[#e8e8e8]" />

      <div className="flex flex-col items-center gap-4 w-full">
        <button
          type="button"
          onClick={primary.onClick}
          disabled={primary.disabled}
          className={cn(
            "flex items-center justify-center gap-2.5 h-[42px] w-full max-w-[589px] rounded-[10px] text-[16px] font-bold text-white drop-shadow-[0px_16px_20px_rgba(88,92,95,0.11)] transition active:scale-[0.98] disabled:opacity-60",
            success ? "bg-[var(--auth-primary)]" : "bg-[#f71529]",
          )}>
          {primary.label}
        </button>
        <button
          type="button"
          onClick={secondary.onClick}
          className="h-12 w-full max-w-[367px] rounded-xl border-2 border-[#333]/10 bg-white text-[16px] font-bold text-[var(--auth-neutral-800)] transition hover:bg-gray-50">
          {secondary.label}
        </button>
      </div>
    </div>
  );
}
