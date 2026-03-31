/* Email + Password login form for teachers */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teacherLogin } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Field } from "./field";

const teacherSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type TeacherLoginForm = z.infer<typeof teacherSchema>;

export default function TeacherLoginForm({
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
  } = useForm<TeacherLoginForm>({
    resolver: zodResolver(teacherSchema),
  });

  const onSubmit = async (data: TeacherLoginForm) => {
    try {
      setLoading(true);
      setApiError(null);

      const res = await teacherLogin(data.email, data.password);

      login(res.token, { id: res.userId, role: "teacher", ...res.user } as any);

      // if (res.firstLogin) {
      //   navigate("/onboarding");
      // } else {
      navigate("/");
      // }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex flex-col gap-4">
        {apiError && (
          <div className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 text-left">
            {apiError}
          </div>
        )}

        <Field label="Email Address" error={errors.email?.message}>
          <input
            type="email"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
            {...register("email")}
            placeholder="teacher@school.com"
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <input
            type="password"
            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
            {...register("password")}
            placeholder="••••••••"
          />
        </Field>

        <div
          className="w-fit ml-auto text-end text-indigo-600 text-[10px] font-black uppercase leading-4 tracking-wide cursor-pointer"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-2 py-4 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign in as Teacher"}
        </button>
      </div>
    </form>
  );
}
