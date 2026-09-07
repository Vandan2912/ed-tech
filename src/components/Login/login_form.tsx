/* Unified email/password + Google sign-in form (Figma: Login) */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { teacherLogin, googleAuth } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { FormField, authInputClassName } from "@/components/auth/FormField";
import { getApiErrorMessage } from "@/lib/utils";
import googleIcon from "@/assets/auth/google-icon.svg";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({
  setLoading,
  onForgotPassword,
}: {
  setLoading: (v: boolean) => void;
  onForgotPassword: () => void;
}) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await teacherLogin(data.email, data.password);
      login(res.token, res.user);
      navigate("/");
    } catch (err) {
      setApiError(
        getApiErrorMessage(
          err,
          "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setApiError(null);
        const res = await googleAuth(tokenResponse.access_token, "student");
        login(res.token, res.user);

        const needsOnboarding = res.isNewUser || !res.user?.is_onboarded;
        navigate(needsOnboarding ? "/onboarding" : "/");
      } catch (err) {
        setApiError(
          getApiErrorMessage(err, "Google sign-in failed. Please try again."),
        );
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setApiError("Google sign-in failed. Please try again.");
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full">
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

      <FormField
        label="Password"
        error={errors.password?.message}
        action={
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[13px] font-semibold text-[#0a0a0a] hover:text-[#3eaef0] transition-colors">
            Forget Password?
          </button>
        }>
        <input
          type="password"
          className={authInputClassName}
          placeholder="Enter Your Password Here"
          {...register("password")}
        />
      </FormField>

      <label className="flex items-start gap-2 w-full cursor-pointer">
        <input
          type="checkbox"
          className="mt-[3px] size-[15px] rounded-[4px] border border-[#b4b4b4] accent-[#3eaef0]"
          {...register("agreeToTerms")}
        />
        <span className="text-[12px] font-semibold text-[#99a1af] text-left leading-[18px]">
          By continuing, you agree to our{" "}
          <a href="#" className="text-[#3eaef0]">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#3eaef0]">
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.agreeToTerms && (
        <span className="-mt-4 text-red-500 text-xs font-semibold">
          {errors.agreeToTerms.message}
        </span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] flex items-center justify-center text-white text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed transition active:scale-[0.98]">
        {isSubmitting ? "Signing in..." : "Login"}
      </button>

      <div className="flex items-center gap-4 w-full">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-sm font-medium text-[#606060] whitespace-nowrap">
          Create an account and Sign in
        </span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <button
        type="button"
        onClick={() => googleLogin()}
        className="w-full h-[60px] bg-white border-2 border-[#f3f4f6] rounded-2xl flex items-center justify-center gap-2.5 transition-all hover:border-[#3eaef0]/40 hover:bg-[#3eaef0]/5">
        <span className="flex items-center justify-center size-6 rounded-full bg-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
          <img src={googleIcon} alt="" className="size-4" />
        </span>
        <span className="font-bold text-base text-[#364153]">
          Continue With Google
        </span>
      </button>
    </form>
  );
}
