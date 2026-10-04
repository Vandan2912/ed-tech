import { Brain, Sparkles, Trophy } from "lucide-react";

const STEPS = [
  {
    icon: Brain,
    iconBg: "bg-[#f0f9ff]",
    iconColor: "text-[#0084d1]",
    step: "Step 01",
    title: "Enter Any Topic",
    description:
      "Type any topic name and description, or upload a photo of your textbook page.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-[#fff3c2]",
    iconColor: "text-[#e17100]",
    step: "Step 02",
    title: "AI Generates Quiz",
    description:
      "Our engine builds a personalised 3-stage quiz — Easy, Medium, then Hard — tailored to your topic.",
  },
  {
    icon: Trophy,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-[#009966]",
    step: "Step 03",
    title: "Level Up & Rank",
    description:
      "Earn points for every correct answer. Clear all 3 stages to advance your level and climb the leaderboard.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-[#fffcfa] py-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex px-4 py-1.5 rounded-full bg-[var(--auth-primary-alpha-10)] text-[13px] font-bold text-[var(--auth-primary-dark-2)]">
          The Process
        </span>
        <h2 className="text-[32px] font-bold text-[#101828]">
          From topic to mastery in minutes
        </h2>
        <p className="text-[14px] font-medium text-[var(--auth-neutral-800)] max-w-lg">
          AI builds a personalised 3-stage quiz from any topic in seconds — no
          prep needed.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 relative">
        <div className="hidden sm:block absolute top-8 left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] border-t-2 border-dashed border-[#f3f4f6]" />
        {STEPS.map(
          ({ icon: Icon, iconBg, iconColor, step, title, description }) => (
            <div key={step} className="relative flex flex-col gap-1">
              <span
                className={`flex items-center justify-center size-16 rounded-2xl ${iconBg}`}>
                <Icon size={24} className={iconColor} />
              </span>
              <span className="pt-5 text-[12px] font-bold text-[#08486d]">
                {step}
              </span>
              <h3 className="pt-1 text-[18px] font-extrabold text-[#101828]">
                {title}
              </h3>
              <p className="pt-2 text-[14px] font-medium text-[var(--auth-neutral-500)] max-w-[260px]">
                {description}
              </p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
