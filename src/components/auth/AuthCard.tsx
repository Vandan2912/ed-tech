import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-page auth/onboarding shell: light background, two blurred accent
 * blobs, and a centered white card. Shared by Login, forgot-password,
 * reset-password and onboarding screens (Figma "Onboarding Flow").
 */
export function AuthShell({
  children,
  className,
  maxWidthClassName = "max-w-md",
}: {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
}) {
  return (
    <div className="min-h-dvh w-screen flex flex-col items-center justify-center relative overflow-x-hidden bg-[#f9fafb] p-4 sm:p-8">
      <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-[rgba(219,234,254,0.5)] blur-3xl right-[-6rem] top-[-6rem] hidden sm:block" />
      <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-[rgba(224,231,255,0.5)] blur-3xl left-[-6rem] bottom-[-6rem] hidden sm:block" />

      <div
        className={cn(
          "relative z-10 w-full mx-auto bg-white rounded-[24px] sm:rounded-[40px] border border-[#f3f4f6] shadow-[0px_20px_25px_rgba(0,0,0,0.05)]",
          maxWidthClassName,
          className,
        )}>
        {children}
      </div>
    </div>
  );
}
