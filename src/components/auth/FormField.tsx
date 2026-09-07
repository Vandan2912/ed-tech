import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const authInputClassName =
  "w-full px-5 py-4 bg-white border border-[#f3f4f6] rounded-2xl text-[15px] font-semibold text-[#0a0a0a] placeholder:text-[#bbbbbb] placeholder:font-semibold focus:outline-none focus:ring-4 focus:ring-[#3eaef0]/15 focus:border-[#3eaef0]/40 transition-all disabled:bg-[#f9fafb] disabled:text-[#a4a4a4]";

export function FormField({
  label,
  children,
  error,
  className,
  action,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
  /** Optional trailing element next to the label, e.g. "Forget Password?" */
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2 items-start w-full", className)}>
      <div className="flex items-center justify-between w-full px-1">
        <label className="text-[13px] font-semibold text-[#8a8a8a] capitalize">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <span className="text-red-500 text-xs font-semibold px-1">
          {error}
        </span>
      )}
    </div>
  );
}
