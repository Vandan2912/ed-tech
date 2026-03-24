import { Field } from "@/components/Login/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { forgotPassword } from "@/api/auth";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const Forgot = ({
  setStage,
  onEmailSubmit,
}: {
  setStage: React.Dispatch<
    React.SetStateAction<{
      forgot: boolean;
      forgotOTP: boolean;
      newPassword: boolean;
    }>
  >;
  onEmailSubmit: (email: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      setLoading(true);
      setApiError(null);

      await forgotPassword(data.email);

      onEmailSubmit(data.email);
      setStage((prev) => ({ ...prev, forgotOTP: true }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl inline-flex justify-center items-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6H20V18H4V6Z"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 6L12 13L20 6"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-black text-gray-900 mb-3">
        Forgot Password?
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 font-medium mb-10 px-8">
        No worries! Enter your registered email and we'll send you a reset code.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {apiError && (
          <div className="w-full px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 text-left">
            {apiError}
          </div>
        )}

        <Field label="Email Address" error={errors.email?.message}>
          <div className="relative w-full">
            <Mail
              size={16}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              {...register("email")}
              placeholder="you@school.edu"
              className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all font-bold text-gray-900"
            />
          </div>
        </Field>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition active:scale-[0.98] cursor-pointer hover:bg-blue-800 shadow-xl shadow-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(90deg,#4F46E5 0%,#4338CA 100%)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.35)",
          }}
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </>
  );
};

export default Forgot;
