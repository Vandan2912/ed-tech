import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    name: "Easy",
    description: "Build your foundation. 70% to advance.",
    accent: "bg-[#00d492]",
    showChevron: false,
    bullets: [
      "10 Questions to clear",
      "2 points per correct answer",
      "60s countdown timer active",
    ],
    rows: [
      { title: "10 Questions", subtitle: "to complete the Level" },
      { title: "2 points / question", subtitle: "earned on correct answer" },
      { title: "60s per question", subtitle: "countdown timer active" },
      {
        title: "Score 20 points to pass",
        subtitle: "Move forward to the Easy to Medium stage",
      },
    ],
  },
  {
    name: "Medium",
    description: "Test deeper understanding. 70% to advance.",
    accent: "bg-[#ffb900]",
    showChevron: true,
    bullets: [
      "20 Questions to clear",
      "3 points per correct answer",
      "60s countdown timer active",
    ],
    rows: [
      { title: "20 Questions", subtitle: "to complete the stage" },
      { title: "3 points / question", subtitle: "earned on correct answer" },
      { title: "60s per question", subtitle: "countdown timer active" },
      {
        title: "Score 60 points to pass",
        subtitle: "Move forward to the Medium to Hard stage",
      },
    ],
  },
  {
    name: "Hard",
    description: "Master the topic. Maximum points earned here.",
    accent: "bg-[#ff637e]",
    showChevron: true,
    bullets: [
      "40 Questions to clear",
      "4 points per correct answer",
      "60s countdown timer active",
    ],
    rows: [
      { title: "40 Questions", subtitle: "to complete the stage" },
      { title: "4 points / question", subtitle: "highest point multiplier" },
      { title: "60s per question", subtitle: "countdown timer active" },
      {
        title: "Score 160 points to pass",
        subtitle: "Complete Hard to unlock the levels",
      },
    ],
  },
];

export function QuizStructure() {
  return (
    <section className="sm:bg-[#f9fafb]/50 py-4 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-1 sm:gap-3 text-center">
        <span className="inline-flex px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#f0f9ff] sm:bg-[var(--auth-primary-alpha-10)] text-[11px] sm:text-[13px] font-bold text-[var(--auth-primary)] sm:text-[var(--auth-primary-dark-2)]">
          Quiz Structure
        </span>
        <h2 className="text-[18px] font-extrabold sm:text-[32px] sm:font-bold text-[#1e2939] sm:text-[#101828]">
          Three stages. One level cleared.
        </h2>
        <p className="hidden sm:block text-[14px] font-medium text-[var(--auth-neutral-800)]">
          Pass each stage with 70%+ to advance and climb the leaderboard.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-3 sm:pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {STAGES.map((stage) => (
          <div
            key={stage.name}
            className="bg-white border border-[#f3f4f6] rounded-2xl sm:rounded-[20px] p-4 sm:p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] sm:text-[24px] font-bold text-[#1e2939] sm:text-[#101828]">
                {stage.name}
                <span className="sm:hidden"> Stage</span>
              </h3>
              <span
                className={cn("sm:hidden w-[3px] h-5 rounded-[2px]", stage.accent)}
              />
            </div>
            <p className="pt-3 sm:pt-1 sm:pb-4 text-[12px] sm:font-medium text-[#6b7280] sm:text-[var(--auth-neutral-800)]">
              {stage.description}
            </p>
            <ul className="sm:hidden flex flex-col gap-1.5 pt-3 text-[11px] font-semibold text-[#1e2939]">
              {stage.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
            <div className="hidden sm:flex flex-col gap-2">
              {stage.rows.map((row, i) => (
                <div
                  key={row.title}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-[#f9fafb]">
                  <span
                    className={cn("w-[2px] h-7 rounded-full", stage.accent)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-[#1e2939]">
                      {row.title}
                    </p>
                    <p className="text-[8px] font-medium text-[#99a1af]">
                      {row.subtitle}
                    </p>
                  </div>
                  {stage.showChevron && i === 0 && (
                    <ChevronRight size={12} className="text-[#d1d5dc]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
