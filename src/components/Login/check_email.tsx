/* Forgot-password: check your email (Figma: forgot-password-check-email) */

import { useState } from "react";
import { resendOtp } from "@/api/auth";
import mailIcon from "@/assets/auth/mail-icon.svg";

export default function CheckEmail({
  email,
  onBackToLogin,
}: {
  email: string;
  onBackToLogin: () => void;
}) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    try {
      setResending(true);
      await resendOtp(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      console.error("Failed to resend reset email", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full text-center">
      <div className="flex items-center justify-center size-20 rounded-full bg-[#eff6ff]">
        <img src={mailIcon} alt="" className="size-10" />
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Check Your Email</h1>
        <p className="text-xs font-semibold text-[#6b7280] leading-[18px] max-w-[318px]">
          We&apos;ve sent a password reset link to your email address. Please
          check your inbox and click the link to continue.
        </p>
      </div>

      <p className="flex gap-1 items-center pt-2 text-sm">
        <span className="text-[#6b7280]">Didn&apos;t receive the email?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="font-bold text-[#3eaef0] disabled:opacity-60">
          {resending ? "Resending..." : resent ? "Sent!" : "Resend"}
        </button>
      </p>

      <button
        type="button"
        onClick={onBackToLogin}
        className="pt-3 text-[15px] font-semibold text-[#3eaef0]">
        Back to Login
      </button>
    </div>
  );
}
