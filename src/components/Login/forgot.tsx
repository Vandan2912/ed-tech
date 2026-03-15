import { Field } from "@/pages/Login";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const Forgot = ({
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
  const stepSchema = z.object({
    email: z.string().email("Invalid email"),
  });

  const schema = stepSchema;
  type LoginFormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    setStage((prev) => ({ ...prev, forgotOTP: true }));
    console.log("FINAL FORM DATA", data);
  };

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
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20V18H4V6Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 6L12 13L20 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-black text-gray-900 mb-3">Forgot Password?</h1>

      {/* Subtitle */}
      <p className="text-gray-500 font-medium mb-10 px-8">
        No worries! Enter your registered email and we'll send you a reset code.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Field label="Email Address" error={errors.email?.message}>
          <div className="relative w-full">
            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

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
          className="mt-4 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition active:scale-[0.98] cursor-pointer hover:bg-blue-800 shadow-xl shadow-blue-100"
          style={{
            background: "linear-gradient(90deg,#4F46E5 0%,#4338CA 100%)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.35)",
          }}>
          Send Reset Code
        </button>
      </form>
    </>
  );
};

export default Forgot;
