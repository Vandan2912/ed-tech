import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Eye, EyeOff } from "lucide-react";

/* ---------------- SCHEMA ---------------- */

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

/* ---------------- PASSWORD STRENGTH ---------------- */

function getStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

/* ---------------- PAGE ---------------- */

export default function CreateNewPassword({
  setStage,
}: {
  setStage: React.Dispatch<
    React.SetStateAction<{
      forgot: boolean;
      forgotOTP: boolean;
      newPassword: boolean;
    }>
  >;
}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [complete, setComplete] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password") || "";
  const strength = getStrength(password);

  const onSubmit = (data: FormData) => {
    console.log("Reset password:", data);

    // call backend
    // await api.post("/auth/reset-password", data)
    setComplete(true);
  };

  if (complete) {
    return (
      <>
        <div className="w-20 h-20 bg-green-100 rounded-full inline-flex justify-center items-center mb-6">
          <CircleCheck size={40} className="text-[#00A63E]" />
        </div>
        <div className="text-center justify-start text-gray-900 text-2xl font-black leading-8 mb-2">
          Password Reset!
        </div>
        <div className="text-center justify-start text-gray-500 text-sm font-medium leading-5">
          Your password has been successfully updated.{" "}
        </div>
        <div className="text-center justify-start text-gray-500 text-sm font-medium leading-5 mb-8">
          You can now sign in with your new password.
        </div>
        <button
          className="w-96 h-12 bg-indigo-700 rounded-2xl shadow-[0px_10px_15px_-3px_rgba(224,231,255,1.00)] text-center justify-start text-white text-sm font-black uppercase leading-5 tracking-wider cursor-pointer"
          onClick={() => {
            setStage({ forgot: false, forgotOTP: false, newPassword: false });
          }}>
          Back to Sign In
        </button>
      </>
    );
  }

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 mb-6">
        ← Back to sign in
      </button>

      {/* Icon */}
      <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M3.44833 23.2187C2.94819 23.7187 2.66714 24.3969 2.66699 25.1041V28.0001C2.66699 28.3537 2.80747 28.6928 3.05752 28.9429C3.30756 29.1929 3.6467 29.3334 4.00033 29.3334H8.00033C8.35395 29.3334 8.69309 29.1929 8.94313 28.9429C9.19318 28.6928 9.33366 28.3537 9.33366 28.0001V26.6667C9.33366 26.3131 9.47414 25.974 9.72418 25.7239C9.97423 25.4739 10.3134 25.3334 10.667 25.3334H12.0003C12.3539 25.3334 12.6931 25.1929 12.9431 24.9429C13.1932 24.6928 13.3337 24.3537 13.3337 24.0001V22.6667C13.3337 22.3131 13.4741 21.974 13.7242 21.7239C13.9742 21.4739 14.3134 21.3334 14.667 21.3334H14.8963C15.6035 21.3332 16.2817 21.0522 16.7817 20.5521L17.867 19.4667C19.7201 20.1122 21.7374 20.1098 23.589 19.4597C25.4405 18.8097 27.0166 17.5505 28.0595 15.8882C29.1023 14.2259 29.5502 12.2589 29.3298 10.309C29.1094 8.35912 28.2338 6.54172 26.8462 5.15414C25.4587 3.76657 23.6413 2.89096 21.6913 2.67057C19.7414 2.45018 17.7744 2.89805 16.1122 3.94091C14.4499 4.98377 13.1907 6.55988 12.5407 8.41141C11.8906 10.2629 11.8881 12.2803 12.5337 14.1334L3.44833 23.2187Z"
            stroke="#432DD7"
            stroke-width="2.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M21.9997 10.6666C22.3679 10.6666 22.6663 10.3681 22.6663 9.99992C22.6663 9.63173 22.3679 9.33325 21.9997 9.33325C21.6315 9.33325 21.333 9.63173 21.333 9.99992C21.333 10.3681 21.6315 10.6666 21.9997 10.6666Z"
            fill="#432DD7"
            stroke="#432DD7"
            stroke-width="2.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black text-gray-900 mb-3">Create New Password</h1>

      <p className="text-gray-500 font-medium mb-10">Your new password must be at least 6 characters long.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* New Password */}

        <Field label="New Password" error={errors.password?.message}>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Akash123"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </Field>

        {/* Confirm Password */}

        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <div className="relative  w-full">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Akash123"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirm ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </Field>

        {/* Strength Meter */}

        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full ${strength >= level ? "bg-indigo-500" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase text-left">{strength >= 3 ? "Strong" : "Weak"}</p>

        {/* Button */}

        <button
          type="submit"
          className="mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition active:scale-[0.98]"
          style={{
            background: "linear-gradient(90deg,#4F46E5 0%,#4338CA 100%)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.35)",
          }}>
          Reset Password
        </button>
      </form>
    </>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs font-semibold">{error}</span>}
    </div>
  );
}
