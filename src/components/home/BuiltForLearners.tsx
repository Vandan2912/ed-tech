import { Target, Trophy, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Trophy,
    eyebrow: "Leaderboard",
    title: "Rank by effort, not luck",
    mobileTitle: "Competitive Leaderboard",
    description:
      "Your score is calculated from points earned divided by time taken, multiplied by questions attempted. The more you push, the higher you climb.",
  },
  {
    icon: Zap,
    eyebrow: "Level System",
    title: "Progress topic by topic",
    mobileTitle: "Structured Level System",
    description:
      "Complete all 3 difficulty stages of a topic to level up. Every cleared topic adds to your overall level and unlocks new achievement milestones.",
  },
  {
    icon: Target,
    eyebrow: "Point Bonus",
    title: "More questions, bigger rewards",
    mobileTitle: "Point Bonus",
    // Mobile design shows only the first two features
    hideOnMobile: true,
    description:
      "Before starting, you can add extra questions to any stage. A higher question count increases your score — multiplier risk more, earn more.",
  },
];

export function BuiltForLearners() {
  return (
    <section className="sm:border-t border-[#f3f4f6] sm:bg-white py-4 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-1 text-center">
        <h2 className="text-[18px] font-extrabold sm:text-[32px] sm:font-bold text-[#1e2939] sm:text-[#101828]">
          Built for competitive learners
        </h2>
        <p className="text-[12px] text-[#6b7280] sm:text-[14px] sm:font-medium sm:text-[var(--auth-neutral-800)]">
          Score higher by learning smarter, not just longer.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map(
          ({
            icon: Icon,
            eyebrow,
            title,
            mobileTitle,
            description,
            hideOnMobile,
          }) => (
          <div
            key={eyebrow}
            className={`${hideOnMobile ? "hidden sm:flex" : "flex"} flex-col gap-2 sm:gap-1.5 rounded-2xl bg-[#333]/[0.02] border border-[#f3f4f6] sm:border-0 p-4 sm:px-6 sm:py-6`}>
            <span className="flex items-center justify-center size-8 sm:size-10 rounded-lg sm:rounded-[14px] bg-[#dff2fe]">
              <Icon className="size-4 sm:size-5 text-[var(--auth-primary-dark-3)]" />
            </span>
            <p className="hidden sm:block pt-4 text-[11px] font-bold text-[var(--auth-primary-dark-2)]">
              {eyebrow}
            </p>
            <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1e2939] sm:text-[#101828]">
              <span className="sm:hidden">{mobileTitle}</span>
              <span className="hidden sm:inline">{title}</span>
            </h3>
            <p className="sm:pt-2 text-[12px] leading-[1.4] sm:leading-normal sm:font-medium text-[#6b7280] sm:text-[#6a7282]">
              {description}
            </p>
          </div>
          ),
        )}
      </div>
    </section>
  );
}
