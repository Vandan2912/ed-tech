import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    name: "Easy",
    description: "Build your foundation. 70% to advance.",
    accent: "bg-[#00d492]",
    showChevron: false,
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
    <section className="bg-[#f9fafb]/50 py-16">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex px-4 py-1.5 rounded-full bg-[var(--auth-primary-alpha-10)] text-[13px] font-bold text-[var(--auth-primary-dark-2)]">
          Quiz Structure
        </span>
        <h2 className="text-[32px] font-bold text-[#101828]">
          Three stages. One level cleared.
        </h2>
        <p className="text-[14px] font-medium text-[var(--auth-neutral-800)]">
          Pass each stage with 70%+ to advance and climb the leaderboard.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STAGES.map((stage) => (
          <div
            key={stage.name}
            className="bg-white border border-[#f3f4f6] rounded-[20px] p-5 flex flex-col">
            <h3 className="text-[24px] font-bold text-[#101828]">
              {stage.name}
            </h3>
            <p className="pt-1 pb-4 text-[12px] font-medium text-[var(--auth-neutral-800)]">
              {stage.description}
            </p>
            <div className="flex flex-col gap-2">
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
