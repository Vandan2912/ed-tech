import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OTPInput } from "./otp_input";
import { useEffect, useState } from "react";
import { verifyOtp, resendOtp } from "@/api/auth";

const ForgotOtp = ({
  setStage,
  email,
}: {
  setStage: React.Dispatch<
    React.SetStateAction<{
      forgot: boolean;
      forgotOTP: boolean;
      newPassword: boolean;
    }>
  >;
  email: string;
}) => {
  const [completedOtp, setCompletedOtp] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  const handleOtpComplete = (otp: string) => {
    setCompletedOtp(otp);
  };

  const handleVerify = async () => {
    const otp = completedOtp;
    if (!otp || otp.length < 6) {
      setApiError("Please enter the full 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setApiError(null);

      await verifyOtp(email, otp);

      setStage((prev) => ({ ...prev, newPassword: true }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setApiError(null);
      setResendMsg(null);

      await resendOtp(email);

      setResendMsg("A new code has been sent to your email.");
      setActive(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend code. Please try again.";
      setApiError(message);
    }
  };

  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setActive(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [active]);

  return (
    <>
      {/* Back button */}
      <button
        onClick={() => {
          setStage({ forgot: false, forgotOTP: false, newPassword: false });
        }}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 transition mb-6"
      >
        <ArrowLeft size={14} />
        <div className="text-center justify-start text-gray-400 text-[10px] font-black uppercase leading-4 tracking-wide">
          Back to Sign In
        </div>
      </button>

      {/* Icon */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-xl sm:rounded-2xl inline-flex justify-center items-center mb-4 sm:mb-6">
        <ShieldCheck className="text-indigo-700 w-6 h-6 sm:w-8 sm:h-8" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-3">
        Verify Your Email
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-gray-500 font-medium mb-1 sm:mb-3 px-0 sm:px-8">
        We've sent a 6-digit code to
      </p>

      {/* Email */}
      <p className="text-center justify-center text-indigo-700 text-sm sm:text-base font-black leading-5 mb-6 sm:mb-10 break-all">
        {email}
      </p>

      {/* Form */}
      <div className="flex flex-col gap-6">
        {apiError && (
          <div className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 text-left">
            {apiError}
          </div>
        )}

        {resendMsg && (
          <div className="w-full px-4 py-3 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-600 text-left">
            {resendMsg}
          </div>
        )}

        <div className="relative w-full flex justify-center overflow-hidden sm:overflow-visible">
          <OTPInput length={6} onComplete={handleOtpComplete} />
        </div>

        {/* Button */}
        <button
          type="button"
          disabled={loading || !completedOtp || completedOtp.length < 6}
          className="mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition active:scale-[0.98] cursor-pointer hover:bg-blue-800 shadow-xl shadow-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(90deg,#4F46E5 0%,#4338CA 100%)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.35)",
          }}
          onClick={handleVerify}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Didn't receive the code?{" "}
          {!active ? (
            <button
              onClick={handleResend}
              className="text-blue-900 hover:underline cursor-pointer"
            >
              Resend Code
            </button>
          ) : (
            <span>Resend in {timeLeft}s</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotOtp;
