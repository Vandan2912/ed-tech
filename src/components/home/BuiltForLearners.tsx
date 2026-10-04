import { Target, Trophy, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Trophy,
    eyebrow: "Leaderboard",
    title: "Rank by effort, not luck",
    description:
      "Your score is calculated from points earned divided by time taken, multiplied by questions attempted. The more you push, the higher you climb.",
  },
  {
    icon: Zap,
    eyebrow: "Level System",
    title: "Progress topic by topic",
    description:
      "Complete all 3 difficulty stages of a topic to level up. Every cleared topic adds to your overall level and unlocks new achievement milestones.",
  },
  {
    icon: Target,
    eyebrow: "Point Bonus",
    title: "More questions, bigger rewards",
    description:
      "Before starting, you can add extra questions to any stage. A higher question count increases your score — multiplier risk more, earn more.",
  },
];

export function BuiltForLearners() {
  return (
    <section className="border-t border-[#f3f4f6] bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-1 text-center">
        <h2 className="text-[32px] font-bold text-[#101828]">
          Built for competitive learners
        </h2>
        <p className="text-[14px] font-medium text-[var(--auth-neutral-800)]">
          Score higher by learning smarter, not just longer.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map(({ icon: Icon, eyebrow, title, description }) => (
          <div
            key={eyebrow}
            className="flex flex-col gap-1.5 rounded-2xl bg-[#333]/[0.02] px-6 py-6">
            <span className="flex items-center justify-center size-10 rounded-[14px] bg-[#dff2fe]">
              <Icon size={20} className="text-[var(--auth-primary-dark-3)]" />
            </span>
            <p className="pt-4 text-[11px] font-bold text-[var(--auth-primary-dark-2)]">
              {eyebrow}
            </p>
            <h3 className="text-[15px] font-bold text-[#101828]">{title}</h3>
            <p className="pt-2 text-[12px] font-medium text-[#6a7282]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
