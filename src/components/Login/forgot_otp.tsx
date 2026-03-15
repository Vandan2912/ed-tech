import { ArrowLeft, ShieldCheck } from "lucide-react";
import { OTPInput } from "./Otp_input";
import { useEffect, useState } from "react";

const ForgotOtp = ({
  setStage,
}: {
  setStage: React.Dispatch<
    React.SetStateAction<{
      forgot: boolean;
      forgotOTP: boolean;
      newPassword: boolean;
    }>
  >;
}) => {
  const [completedOtp, setCompletedOtp] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);

  const handleOtpComplete = (otp: string) => {
    setCompletedOtp(otp);
    setStage((prev) => ({ ...prev, newPassword: true }));
    console.log("OTP entered:", otp);
  };
  console.log("OTP entered:", completedOtp);

  const handleResend = () => {
    // onResend();
    setActive(true);
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
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 transition mb-6">
        <ArrowLeft size={14} />
        <div className="text-center justify-start text-gray-400 text-[10px] font-black uppercase leading-4 tracking-wide">
          Back to Sign In
        </div>
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl inline-flex justify-center items-center mb-6">
        <ShieldCheck size={32} className="text-indigo-700" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-black text-gray-900 mb-3">Verify Your Email</h1>

      {/* Subtitle */}
      <p className="text-gray-500 font-medium mb-3 px-8">We've sent a 6-digit code to</p>

      {/* Email */}
      <p className="text-center justify-start text-indigo-700 text-sm font-black leading-5 mb-10">akash@gmail.com</p>

      {/* Form */}
      <div className="flex flex-col gap-6">
        <div className="relative w-full">
          <OTPInput length={6} onComplete={handleOtpComplete} />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition active:scale-[0.98] cursor-pointer hover:bg-blue-800 shadow-xl shadow-blue-100"
          style={{
            background: "linear-gradient(90deg,#4F46E5 0%,#4338CA 100%)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.35)",
          }}
          onClick={() => {
            handleOtpComplete("121212");
          }}>
          Verify Code
        </button>

        <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
          Didn't receive the code?{" "}
          {!active ? (
            <button onClick={handleResend} className="text-blue-900 hover:underline cursor-pointer">
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
