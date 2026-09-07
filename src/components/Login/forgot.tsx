/* Forgot-password: enter email (Figma: forgot-password-enter-email) */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPassword } from "@/api/auth";
import { FormField, authInputClassName } from "@/components/auth/FormField";
import { getApiErrorMessage } from "@/lib/utils";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function Forgot({
  onEmailSubmit,
  onBackToLogin,
}: {
  onEmailSubmit: (email: string) => void;
  onBackToLogin: () => void;
}) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      setApiError(null);
      await forgotPassword(data.email);
      onEmailSubmit(data.email);
    } catch (err) {
      setApiError(
        getApiErrorMessage(err, "Something went wrong. Please try again."),
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full text-center">
      <h1 className="text-2xl font-bold text-[#0a0a0a]">Forgot Password?</h1>
      <p className="text-xs font-semibold text-[#6b7280] leading-[18px] max-w-[296px]">
        Enter your registered email address and we&apos;ll send you a link to
        reset your password.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center w-full pt-3">
        {apiError && (
          <div className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 text-left">
            {apiError}
          </div>
        )}

        <FormField label="Email" error={errors.email?.message}>
          <input
            type="email"
            className={authInputClassName}
            placeholder="e.g akash@gmail.com"
            {...register("email")}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] flex items-center justify-center text-white text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-[0.98]">
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[15px] font-semibold text-[#3eaef0]">
          Back to Login
        </button>
      </form>
    </div>
  );
}
