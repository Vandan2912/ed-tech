import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "@/components/auth/AuthCard";
import { Logo } from "@/components/auth/Logo";
import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import checkIcon from "@/assets/auth/check-icon.svg";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

/**
 * Target of the (future) password-reset email link — /reset-password?token=...
 * The backend doesn't expose a reset endpoint yet, so submission is UI-only
 * for now; see TODO(backend) below.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [complete, setComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async () => {
    // TODO(backend): no reset-password endpoint exists yet. Wire this up
    // to POST /auth/reset-password with { token, password } once available.
    void token;
    setComplete(true);
  };

  return (
    <AuthShell maxWidthClassName="max-w-[448px]">
      <div className="flex flex-col items-center gap-6 p-6 sm:p-10 text-center">
        <Logo />

        {complete ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="flex items-center justify-center size-20 rounded-full bg-[#ecfdf5]">
              <img src={checkIcon} alt="" className="size-10" />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl font-bold text-[#0a0a0a]">
                Password Changed!
              </h1>
              <p className="text-xs font-semibold text-[#6b7280] leading-[18px] max-w-[302px]">
                Your password has been successfully updated. You can now log
                in with your new password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-2 w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] flex items-center justify-center text-white text-base font-bold transition active:scale-[0.98]">
              Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl font-bold text-[#0a0a0a]">
                Create New Password
              </h1>
              <p className="text-xs font-semibold text-[#6b7280] leading-[18px] max-w-[296px]">
                Your new password must be different from previously used
                passwords.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 items-center w-full pt-2">
              <FormField label="New Password" error={errors.password?.message}>
                <PasswordInput
                  placeholder="Enter New Password"
                  {...register("password")}
                />
              </FormField>

              <FormField
                label="Confirm Password"
                error={errors.confirmPassword?.message}>
                <PasswordInput
                  placeholder="Confirm New Password"
                  {...register("confirmPassword")}
                />
              </FormField>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] flex items-center justify-center text-white text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-[0.98]">
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[15px] font-semibold text-[#3eaef0]">
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
