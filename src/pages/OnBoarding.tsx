import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

/* ---------------- ZOD SCHEMA ---------------- */

const step1Schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be 10 digits").max(10, "Phone must be 10 digits"),
});

const step2Schema = z.object({
  schoolName: z.string().min(1, "School name required"),
  district: z.string().min(1, "District required"),
  state: z.string().min(1, "State required"),
  country: z.string(),
});

const schema = step1Schema.merge(step2Schema);

type FormData = z.infer<typeof schema>;

/* ---------------- SUCCESS TOAST ---------------- */

function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed top-6 left-1/2 z-50 transition-all duration-500"
      style={{
        transform: `translateX(-50%) translateY(${visible ? "0" : "-120%"})`,
        opacity: visible ? 1 : 0,
        transitionProperty: "transform, opacity",
        transitionDuration: "400ms",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-2xl"
        style={{
          background: "#FFF",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          minWidth: 280,
          whiteSpace: "nowrap",
        }}>
        {/* Checkmark icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.857 8.191C13.9149 8.11129 13.9566 8.02095 13.9796 7.92514C14.0026 7.82933 14.0065 7.72994 13.991 7.63262C13.9756 7.5353 13.9412 7.44198 13.8897 7.35797C13.8382 7.27396 13.7707 7.20091 13.691 7.143C13.6113 7.08509 13.5209 7.04344 13.4251 7.02044C13.3293 6.99744 13.2299 6.99354 13.1326 7.00895C13.0353 7.02437 12.942 7.0588 12.858 7.11028C12.774 7.16176 12.7009 7.22929 12.643 7.309L9.16 12.099L7.28 10.219C7.21078 10.1474 7.128 10.0903 7.03647 10.051C6.94495 10.0118 6.84653 9.99114 6.74694 9.99032C6.64736 9.9895 6.54861 10.0085 6.45646 10.0463C6.3643 10.084 6.28059 10.1398 6.2102 10.2102C6.13982 10.2807 6.08417 10.3644 6.0465 10.4566C6.00883 10.5488 5.9899 10.6476 5.99081 10.7472C5.99173 10.8467 6.01246 10.9451 6.05181 11.0366C6.09116 11.1281 6.14834 11.2108 6.22 11.28L8.72 13.78C8.79663 13.8567 8.88896 13.9158 8.99065 13.9534C9.09233 13.9909 9.20094 14.006 9.30901 13.9975C9.41708 13.9891 9.52203 13.9573 9.61663 13.9044C9.71123 13.8515 9.79324 13.7787 9.857 13.691L13.857 8.191Z"
            fill="#171717"
          />
        </svg>
        <span
          style={{
            color: "#101828",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "20px",
          }}>
          Successfully authenticated with Google!
        </span>
      </div>
    </div>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "India",
    },
  });

  useEffect(() => {
    const show = setTimeout(() => setToastVisible(true), 300);
    const hide = setTimeout(() => setToastVisible(false), 3500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  /* ---------------- STEP NAVIGATION ---------------- */

  const nextStep = async () => {
    const valid = await trigger(["firstName", "lastName", "email", "phone"]);
    if (valid) setStep(2);
  };

  const prevStep = () => setStep(1);

  const onSubmit = (data: FormData) => {
    console.log("FINAL FORM DATA", data);
    navigate("/dashboard");
  };

  return (
    <div className="onboarding min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <SuccessToast visible={toastVisible} />

      <div className="relative w-full mx-4 flex flex-col overflow-hidden max-w-170 bg-white rounded-[40px] shadow-xl border border-gray-100">
        {/* Progress bar */}

        <div className="h-1.5 bg-gray-100 rounded-t-[40px]">
          <div className="h-1.5 bg-[#1C398E] transition-all" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-12 flex flex-col">
          {/* Step badge */}
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-black text-blue-900 uppercase tracking-widest mb-4">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.5 10.5V9.5C9.5 8.96957 9.28929 8.46086 8.91421 8.08579C8.53914 7.71071 8.03043 7.5 7.5 7.5H4.5C3.96957 7.5 3.46086 7.71071 3.08579 8.08579C2.71071 8.46086 2.5 8.96957 2.5 9.5V10.5"
                stroke="#1C398E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 5.5C7.10457 5.5 8 4.60457 8 3.5C8 2.39543 7.10457 1.5 6 1.5C4.89543 1.5 4 2.39543 4 3.5C4 4.60457 4.89543 5.5 6 5.5Z"
                stroke="#1C398E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Step {step} of 2</span>
          </div>

          <h2 className="text-3xl! font-black! text-gray-900! tracking-tight mb-2">
            {step === 1 ? "Personal Information" : "Academic Details"}
          </h2>

          <p className="text-gray-500 font-medium">Please provide accurate details to personalize your experience.</p>

          {/* ---------------- STEP 1 ---------------- */}

          {step === 1 && (
            <div className="flex flex-col gap-6 mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="First Name" error={errors.firstName?.message}>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                    {...register("firstName")}
                    placeholder="Alex"
                  />
                </Field>

                <Field label="Last Name" error={errors.lastName?.message}>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                    {...register("lastName")}
                    placeholder="Johnson"
                  />
                </Field>
              </div>

              <Field label="Email Address (Google)" error={errors.email?.message}>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                  {...register("email")}
                  placeholder="alex@gmail.com"
                />
              </Field>

              <Field label="Mobile Number" error={errors.phone?.message}>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                  {...register("phone")}
                  placeholder="9876543210"
                />
              </Field>

              <button
                type="button"
                onClick={nextStep}
                className="flex-2 py-4 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Next Step
              </button>
            </div>
          )}

          {/* ---------------- STEP 2 ---------------- */}

          {step === 2 && (
            <div className="flex flex-col gap-6 mt-10">
              <Field label="School Name" error={errors.schoolName?.message}>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                  {...register("schoolName")}
                  placeholder="e.g Delhi Public School"
                />
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field label="District" error={errors.district?.message}>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                    {...register("district")}
                    placeholder="e.g Central Delhi"
                  />
                </Field>

                <Field label="State" error={errors.state?.message}>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                    {...register("state")}
                    placeholder="e.g Delhi"
                  />
                </Field>
              </div>

              <Field label="Country">
                <input
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                  {...register("country")}
                  readOnly
                />
              </Field>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all">
                  Back
                </button>

                <button
                  type="submit"
                  className="flex-2 py-4 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                  Complete Signup
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs font-semibold">{error}</span>}
    </div>
  );
}
