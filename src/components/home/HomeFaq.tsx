import { useState } from "react";
import plusIcon from "@/assets/home/faq-plus.svg";
import minusIcon from "@/assets/home/faq-minus.svg";

// Copy from the "FAQ · Content source" frame (Figma 2094:13384).
const FAQS = [
  {
    q: "What is the 10-minute diagnostic?",
    a: "A quick 20-question quiz that maps your current strengths and weaknesses across the syllabus, so your learning path starts from where you actually are.",
  },
  {
    q: "How do I level up from Level 0?",
    a: "Complete the diagnostic and start clearing stages. Every correct answer and finished stage adds points, and you move to the next level once you reach the required points.",
  },
  {
    q: "Can I retake the diagnostic later?",
    a: "Yes. You can retake it anytime from your profile to see how much you've improved, and your learning path updates to match your latest results.",
  },
  {
    q: "How do I unlock the badges?",
    a: "You will get the target to how many levels and points you have to earn to get the next badge for each badge.",
  },
  {
    q: "What is the Mistake Bank?",
    a: "A personalised collection of questions you got wrong, so you can revisit and practice your weak areas until they become strengths.",
  },
  {
    q: "Is there negative marking in the diagnostic?",
    a: "No. The diagnostic only maps what you know, so answer every question honestly without worrying about losing marks.",
  },
  {
    q: "Can I add extra questions to a stage?",
    a: "Each stage has a fixed set of questions so progress is fair for everyone. For extra practice, use the Mistake Bank or replay any stage you've already cleared or enter the same topic with more descriptions to get more types of questions.",
  },
  {
    q: "How do I earn points?",
    a: "You earn points for every correct answer, completing stages, and maintaining your daily streak.",
  },
  {
    q: "Is my progress private?",
    a: "Yes. Your scores, mistakes, and learning path are visible only to you. Only your name and score appear on the leaderboard.",
  },
  {
    q: "What are the 3 stages of a topic?",
    a: "Easy, Medium, and Hard. Each stage unlocks when you clear the one before it.",
  },
  {
    q: "How does the leaderboard work?",
    a: "Your score is calculated from points earned divided by time taken, multiplied by questions attempted, so it rewards both speed and consistency.",
  },
  {
    q: "Where can I find explanations for mistakes?",
    a: "Every question you get wrong shows a step-by-step explanation right after you answer, and you can review it anytime in your Mistake Bank.",
  },
];

const COLUMNS = [FAQS.slice(0, 6), FAQS.slice(6)];

/** FAQ section (Figma 2094:11312): two columns of independent accordions. */
export function HomeFaq() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([FAQS[0].q]));

  const toggle = (q: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });

  return (
    <section className="bg-[rgba(249,250,251,0.5)] py-12 sm:py-16">
      <div className="max-w-[1024px] mx-auto px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="px-6 py-1.5 rounded-full bg-[var(--auth-primary-alpha-10)] text-[13px] leading-[18px] font-bold text-[var(--auth-primary-dark-1)]">
            FAQ
          </span>
          <h2 className="max-w-[600px] text-[24px] leading-8 sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-[#101828]">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[600px] text-[14px] leading-5 font-medium text-[#4a5565]">
            Everything you need to know about your NEET learning journey, from
            diagnostics to leveling up.
          </p>
        </div>

        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
          {COLUMNS.map((items, col) => (
            <div key={col} className="flex flex-col gap-4">
              {items.map(({ q, a }) => {
                const expanded = open.has(q);
                return (
                  <div
                    key={q}
                    className="bg-white border border-[#f3f4f6] rounded-2xl drop-shadow-[0px_2px_2px_rgba(27,28,29,0.04)]">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => toggle(q)}
                      className="flex items-center justify-between gap-3 w-full p-6 text-left">
                      <span className="text-[13px] leading-[18px] font-bold text-[#101828]">
                        {q}
                      </span>
                      <img
                        src={expanded ? minusIcon : plusIcon}
                        alt=""
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                    </button>
                    {expanded && (
                      <p className="px-6 pb-6 -mt-3 text-[12px] leading-4 font-medium text-[#4a5565]">
                        {a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
