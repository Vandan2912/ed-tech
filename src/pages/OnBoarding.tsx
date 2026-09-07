import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { saveAcademicDetails } from "@/api/user";
import type { User } from "@/auth/AuthProvider";
import CountryCodeSelect from "@/components/CountryCodeSelect";
import { Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/auth/Logo";
import { FormField, authInputClassName } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  OnboardingProgressBar,
  StepBadge,
} from "@/components/auth/OnboardingProgress";
import { GoalCard } from "@/components/onboarding/GoalCard";
import { SubjectChip } from "@/components/onboarding/SubjectChip";
import { ProcessingChecklist } from "@/components/onboarding/ProcessingChecklist";
import { FeatureCard } from "@/components/onboarding/FeatureCard";

import featureAiBrain from "@/assets/auth/feature-ai-brain.svg";
import featureStairs from "@/assets/auth/feature-stairs.svg";
import featureDoubtClear from "@/assets/auth/feature-doubt-clear.svg";
import featureGrid from "@/assets/auth/feature-grid.svg";
import featureEmotionalBalance from "@/assets/auth/feature-emotional-balance.svg";
import featureGame from "@/assets/auth/feature-game.svg";

/* ---------------- CONSTANTS ---------------- */

const TOTAL_STEPS = 4;

const GOAL_SUGGESTIONS = [
  {
    title: "NEET Preparation",
    description: "Medical entrance for MBBS / BDS / AYUSH",
  },
  {
    title: "JEE Preparation",
    description: "Engineering entrance Mains & Advanced",
  },
  {
    title: "Civil Services (UPSC)",
    description: "IAS, IPS, IFS and allied services",
  },
  { title: "Board Exams", description: "CBSE, ICSE or State Board finals" },
  {
    title: "Olympiad / Competitive",
    description: "National & international competitions",
  },
  {
    title: "CA / Commerce",
    description: "Chartered Accountancy and commerce streams",
  },
  {
    title: "General Knowledge",
    description: "Current affairs, GK and aptitude",
  },
  { title: "Other / Explore", description: "Just learning and growing" },
];

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "History",
  "Geography",
  "Political Science",
  "Economics",
  "Computer Science",
  "Accountancy",
  "Business Studies",
  "Environmental Science",
  "Sanskrit",
  "Psychology",
  "Sociology",
  "Physical Education",
  "Art & Design",
  "Music",
  "Statistics",
  "Legal Studies",
  "Entrepreneurship",
  "Information Practices",
];

const FEATURES = [
  {
    icon: featureAiBrain,
    title: "AI Challenge",
    description: "AI-powered practice challenges",
  },
  {
    icon: featureStairs,
    title: "Progress Tracker",
    description: "Track your learning journey",
  },
  {
    icon: featureDoubtClear,
    title: "Doubt Clear with AI",
    description: "Instant AI doubt resolution",
  },
  {
    icon: featureGrid,
    title: "Streaks Master",
    description: "Build daily learning streaks",
  },
  {
    icon: featureEmotionalBalance,
    title: "Mental Pressure Monitor",
    description: "Monitor & manage study stress",
  },
  {
    icon: featureGame,
    title: "Gamified Experience",
    description: "Learn through fun & rewards",
  },
];

/* ---------------- ZOD SCHEMA ---------------- */

const step1Schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email"),
  countryCode: z.string().min(1),
  phone: z
    .string()
    .min(10, "Phone must be 10 digits")
    .max(10, "Phone must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
});

const step2Schema = z.object({
  schoolName: z.string().min(1, "School / college name required"),
  standardOrCourse: z.string().min(1, "Standard / course required"),
  district: z.string().min(1, "District required"),
  state: z.string().min(1, "State required"),
  country: z.string().min(1),
  pinCode: z
    .string()
    .min(6, "Invalid PIN")
    .max(6, "Invalid PIN")
    .regex(/^\d+$/, "Digits only"),
});

const schema = step1Schema.merge(step2Schema).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

type FormData = z.infer<typeof schema>;
type Phase = "form" | "processing" | "welcome";

/* ---------------- MAIN COMPONENT ---------------- */

export default function Onboarding() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState<Phase>("form");
  const [goals, setGoals] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      countryCode: "91",
      phone: user?.mobile_number || "",
      password: "",
      confirmPassword: "",
      country: "India",
      district: user?.district || "",
      state: user?.state || "",
      schoolName: user?.school_name || "",
      standardOrCourse: "",
      pinCode: "",
    },
  });

  const countryCodeValue = watch("countryCode");
  const countryValue = watch("country");
  const pinCodeValue = watch("pinCode");
  const [loadingPin, setLoadingPin] = useState(false);

  useEffect(() => {
    if (pinCodeValue?.length === 6 && countryValue === "India") {
      setLoadingPin(true);
      fetch(`https://api.postalpincode.in/pincode/${pinCodeValue}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success") {
            const state = data[0].PostOffice[0].State;
            const district = data[0].PostOffice[0].District;
            setValue("state", state, { shouldValidate: true });
            setValue("district", district, { shouldValidate: true });
          }
        })
        .catch(console.error)
        .finally(() => setLoadingPin(false));
    }
  }, [pinCodeValue, countryValue, setValue]);

  /* ---------------- STEP NAVIGATION ---------------- */

  const nextFromStep1 = async () => {
    const valid = await trigger([
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
      "confirmPassword",
    ]);
    if (valid) setStep(2);
  };

  const nextFromStep2 = async () => {
    const valid = await trigger([
      "schoolName",
      "standardOrCourse",
      "district",
      "state",
      "pinCode",
    ]);
    if (valid) setStep(3);
  };

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const applyGoalSuggestion = (title: string) => {
    setGoals((prev) => (prev ? `${prev}\n${title}` : title));
  };

  const onFinish = async (data: FormData) => {
    setSubmitting(true);
    try {
      const formattedPhone = `${data.countryCode.replace("+", "")} ${data.phone}`;

      const payload = {
        id: user?.id,
        first_name: data.firstName,
        last_name: data.lastName,
        school_name: data.schoolName,
        std: data.standardOrCourse,
        pincode: data.pinCode,
        district: data.district,
        state: data.state,
        country: data.country,
        contact_number: `+${formattedPhone}`,
      };

      // Backend doesn't accept goals/subjects/password yet — persist what it
      // already supports and keep the new fields client-side for now.
      await saveAcademicDetails(payload);

      setUser({ ...user, ...payload, isOnboarded: true } as User);
    } catch (err) {
      console.error("Onboarding failed", err);
    } finally {
      setSubmitting(false);
      setPhase("processing");
    }
  };

  const visibleSubjects = SUBJECTS.filter((s) =>
    s.toLowerCase().includes(subjectSearch.trim().toLowerCase()),
  );

  /* ---------------- PROCESSING / WELCOME PHASES ---------------- */

  if (phase === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-4 relative overflow-hidden">
        <div className="absolute pointer-events-none w-[28rem] h-[28rem] rounded-full bg-[rgba(219,234,254,0.6)] blur-[70px] right-[-8rem] top-[6rem]" />
        <div className="relative z-10 w-full max-w-[800px] bg-white border-2 border-[#e5e7eb] rounded-[32px] shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.03),0px_10px_30px_-10px_rgba(0,0,0,0.04)] p-8 sm:p-14 flex flex-col gap-10 items-center">
          <div className="flex flex-col gap-2.5 items-center text-center">
            <h1 className="text-2xl font-bold text-[#111827]">Almost There!</h1>
            <p className="text-base text-[#6b7280]">
              We&apos;re setting up your personalized learning experience
            </p>
          </div>
          <ProcessingChecklist
            subjectCount={subjects.length}
            onComplete={() => setPhase("welcome")}
          />
        </div>
      </div>
    );
  }

  if (phase === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-4 relative overflow-hidden">
        <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-[rgba(219,234,254,0.6)] blur-[70px] right-[-6rem] top-[-6rem]" />
        <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-[rgba(224,231,255,0.6)] blur-[70px] left-[-6rem] bottom-[-6rem]" />
        <div className="relative z-10 w-full max-w-[800px] bg-white border-2 border-[#e5e7eb] rounded-[32px] shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.03),0px_10px_30px_-10px_rgba(0,0,0,0.04)] p-8 sm:p-14 flex flex-col gap-10 items-center">
          <Logo />

          <div className="flex flex-col gap-3 items-center text-center">
            <h1 className="text-2xl font-bold text-[#111827] max-w-[420px]">
              Your Journey Is Just Getting Started
            </h1>
            <p className="text-sm font-medium text-[#6b7280] max-w-[580px]">
              Explore exciting challenges, level up your skills, earn badges,
              and unlock new milestones as you progress.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {[0, 2, 4].map((i) => (
              <div key={i} className="flex gap-4 w-full">
                <FeatureCard {...FEATURES[i]} />
                <FeatureCard {...FEATURES[i + 1]} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2.5 w-full max-w-[380px] h-12 bg-[#3eaef0] rounded-2xl text-white text-base font-bold shadow-[0px_8px_12px_rgba(62,174,240,0.25)] transition active:scale-[0.98]">
            Getting Started
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- FORM PHASE ---------------- */

  return (
    <div className="onboarding min-h-screen flex items-center justify-center bg-[#f9fafb] p-4 relative overflow-hidden">
      <div className="absolute pointer-events-none w-[31rem] h-[31rem] rounded-full bg-[rgba(219,234,254,0.3)] blur-[64px] right-[-10rem] top-[-16rem]" />
      <div className="absolute pointer-events-none w-[31rem] h-[31rem] rounded-full bg-[rgba(224,231,255,0.3)] blur-[64px] left-[-16rem] bottom-[-16rem]" />

      <div className="relative z-10 w-full flex flex-col max-w-170 bg-white rounded-tl-none rounded-tr-[10px] rounded-bl-[24px] sm:rounded-bl-[40px] rounded-br-[24px] sm:rounded-br-[40px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.06)] border border-[#f3f4f6] overflow-hidden">
        <OnboardingProgressBar step={step} totalSteps={TOTAL_STEPS} />

        <form
          onSubmit={handleSubmit(onFinish)}
          className="p-6 sm:p-12 pt-8 sm:pt-10 flex flex-col relative">
          <div className="mb-4">
            <StepBadge step={step} totalSteps={TOTAL_STEPS} />
          </div>

          <h2 className="text-2xl! sm:text-3xl! font-black! text-gray-900! tracking-tight mb-2">
            {step === 1 && "Personal Information"}
            {step === 2 && "Academic Details"}
            {step === 3 && "What are Your Goals?"}
            {step === 4 && "Pick Your Favourite Subjects"}
          </h2>

          <p className="text-sm sm:text-base text-gray-500 font-medium">
            {step === 4
              ? "Choose as many as you like."
              : "Please provide accurate details to personalize your experience."}
          </p>

          {/* ---------------- STEP 1: PERSONAL INFORMATION ---------------- */}

          {step === 1 && (
            <div className="flex flex-col gap-6 mt-6 sm:mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="First Name" error={errors.firstName?.message}>
                  <input
                    className={authInputClassName}
                    {...register("firstName")}
                    placeholder="Alex"
                  />
                </FormField>

                <FormField label="Last Name" error={errors.lastName?.message}>
                  <input
                    className={authInputClassName}
                    {...register("lastName")}
                    placeholder="Johnson"
                  />
                </FormField>
              </div>

              <FormField label="Email Address" error={errors.email?.message}>
                <div className="relative w-full">
                  <input
                    className={authInputClassName}
                    {...register("email")}
                    readOnly
                    placeholder="alex@gmail.com"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#00bc7d] text-[10px] font-black uppercase tracking-wide">
                    Verified
                  </span>
                </div>
              </FormField>

              <FormField
                label="Create a New Password"
                error={errors.password?.message}>
                <PasswordInput
                  placeholder="Enter a new password"
                  {...register("password")}
                />
              </FormField>

              <FormField
                label="Confirm Password"
                error={errors.confirmPassword?.message}>
                <PasswordInput
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                />
              </FormField>

              <FormField label="Mobile Number" error={errors.phone?.message}>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    value={countryCodeValue}
                    onChange={(code) => setValue("countryCode", code)}
                  />
                  <input
                    className={`flex-1 min-w-0 ${authInputClassName}`}
                    {...register("phone")}
                    placeholder="9876543210"
                    inputMode="numeric"
                  />
                </div>
              </FormField>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  type="button"
                  onClick={nextFromStep1}
                  className="w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] text-white text-base font-bold transition active:scale-[0.98]">
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-12 bg-white border border-[#e8e8e8] rounded-2xl text-[#8e8e8e] text-base font-bold transition hover:text-gray-700">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 2: ACADEMIC DETAILS ---------------- */}

          {step === 2 && (
            <div className="flex flex-col gap-6 mt-6 sm:mt-10">
              <FormField
                label="School or College Name"
                error={errors.schoolName?.message}>
                <input
                  className={authInputClassName}
                  {...register("schoolName")}
                  placeholder="e.g. Delhi Public School / IIT Bombay"
                />
              </FormField>

              <FormField
                label="Standard or Course"
                error={errors.standardOrCourse?.message}>
                <input
                  className={authInputClassName}
                  {...register("standardOrCourse")}
                  placeholder="10th / B.tech Computer Science"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="District" error={errors.district?.message}>
                  <input
                    className={authInputClassName}
                    {...register("district")}
                    placeholder="e.g. Lucknow"
                  />
                </FormField>

                <FormField label="State" error={errors.state?.message}>
                  <input
                    className={authInputClassName}
                    {...register("state")}
                    placeholder="e.g. Uttar Pradesh"
                  />
                </FormField>
              </div>

              <FormField label="Pin Code" error={errors.pinCode?.message}>
                <div className="relative">
                  <input
                    {...register("pinCode")}
                    className={authInputClassName}
                    placeholder="400001"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {loadingPin && (
                    <Loader2
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                      size={16}
                    />
                  )}
                </div>
              </FormField>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  type="button"
                  onClick={nextFromStep2}
                  className="w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] text-white text-base font-bold transition active:scale-[0.98]">
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full h-12 bg-white border border-[#e8e8e8] rounded-2xl text-[#8e8e8e] text-base font-bold transition hover:text-gray-700">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3: GOALS ---------------- */}

          {step === 3 && (
            <div className="flex flex-col gap-6 mt-6 sm:mt-10">
              <FormField label="Describe Your Goals">
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  className={`${authInputClassName} resize-none`}
                  placeholder="e.g. My Goal is Prepare for my board exams ..."
                />
              </FormField>

              <div className="flex flex-col gap-4">
                <p className="text-[13px] font-semibold text-[#8a8a8a] uppercase tracking-wide px-1">
                  Goal Suggestions
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {GOAL_SUGGESTIONS.map((g) => (
                    <GoalCard
                      key={g.title}
                      title={g.title}
                      description={g.description}
                      selected={goals.includes(g.title)}
                      onClick={() => applyGoalSuggestion(g.title)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] text-white text-base font-bold transition active:scale-[0.98]">
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-white border border-[#e8e8e8] rounded-2xl text-[#8e8e8e] text-base font-bold transition hover:text-gray-700">
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ---------------- STEP 4: SUBJECTS ---------------- */}

          {step === 4 && (
            <div className="flex flex-col gap-6 mt-6 sm:mt-10">
              <div className="flex items-center justify-between px-1">
                <span className="text-[13px] font-semibold text-[#8a8a8a] capitalize">
                  Pick or Search Your Subjects
                </span>
                <span className="text-xs font-semibold text-[#0f80c3]">
                  {subjects.length} Selected
                </span>
              </div>

              <input
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className={authInputClassName}
                placeholder="Search subjects..."
              />

              <div className="flex flex-wrap gap-2.5">
                {visibleSubjects.map((subject) => (
                  <SubjectChip
                    key={subject}
                    label={subject}
                    selected={subjects.includes(subject)}
                    onClick={() => toggleSubject(subject)}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  type="submit"
                  disabled={subjects.length === 0 || submitting}
                  className="w-full h-12 bg-[#3eaef0] rounded-2xl drop-shadow-[0px_16px_16px_rgba(88,92,95,0.1)] text-white text-base font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Finishing..." : "Finish"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full h-12 bg-white border border-[#e8e8e8] rounded-2xl text-[#8e8e8e] text-base font-bold transition hover:text-gray-700">
                  Back
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
