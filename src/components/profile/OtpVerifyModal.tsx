import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export function OtpVerifyModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
  verifying = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the entered code when the user submits. */
  onVerify: (otp: string) => void;
  /** Called when the user taps "Resend". */
  onResend?: () => void;
  verifying?: boolean;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset + focus first box whenever the modal opens.
  useEffect(() => {
    if (open) {
      setOtp(Array(OTP_LENGTH).fill(""));
      const t = setTimeout(() => inputRefs.current[0]?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputRefs.current[lastFilled]?.focus();
  };

  const code = otp.join("");
  const complete = code.length === OTP_LENGTH;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#101828]/70 duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-[0px_25px_25px_rgba(0,0,0,0.25)] outline-none duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          aria-describedby="otp-desc"
          onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogPrimitive.Title className="text-2xl font-black tracking-[0.07px] text-[#101828]">
            Verify OTP
          </DialogPrimitive.Title>
          <p id="otp-desc" className="mt-2 text-sm leading-5 tracking-[-0.15px] text-[#4a5565]">
            Enter the 6-digit OTP sent to your WhatsApp
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (complete && !verifying) onVerify(code);
            }}>
            <div className="mt-6 flex items-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={verifying}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-full min-w-0 rounded-[14px] border-2 border-[#d1d5dc] bg-white text-center text-xl font-bold text-[#101828] outline-none transition-colors focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!complete || verifying}
              className={cn(
                "mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase tracking-[1.25px] text-white transition-colors",
                complete && !verifying ? "bg-[#155dfc] hover:bg-[#0e44c7]" : "cursor-not-allowed bg-[#155dfc]/50",
              )}>
              {verifying && <Loader2 className="size-4 animate-spin" />}
              Verify &amp; Update
            </button>
          </form>

          <p className="mt-4 text-center text-xs leading-4 text-[#6a7282]">
            Didn&apos;t receive OTP?{" "}
            <button
              type="button"
              onClick={onResend}
              disabled={verifying}
              className="font-bold text-[#155dfc] hover:underline disabled:opacity-60">
              Resend
            </button>
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
