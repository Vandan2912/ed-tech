import reviewImg from "@/assets/home/mistake-review.png";
import reflectImg from "@/assets/home/mistake-reflect.png";
import improveImg from "@/assets/home/mistake-improve.png";

const CARDS = [
  {
    image: reviewImg,
    title: "Review",
    description:
      "Review highlights where you need more practice so you can focus on weak areas, track progress, identify gaps, and build confidence as tricky concepts become clearer.",
  },
  {
    image: reflectImg,
    title: "Reflect",
    description:
      "Reflection helps you understand why mistakes happened, learn from feedback, clarify confusing concepts with explanations and examples, and retake with confidence once the mistake is clear.",
  },
  {
    image: improveImg,
    title: "Improve",
    description:
      "Improvement turns mistakes into lasting gains by focusing on weak spots, building recall through spaced practice, keeping you on track, and celebrating progress as weak areas become strengths.",
  },
];

/** Mistake Banks section (Figma 2094:11191). */
export function MistakeBanks() {
  return (
    <section
      id="mistake-banks"
      className="relative overflow-hidden bg-[rgba(249,250,251,0.5)] py-12 sm:py-16">
      {/* 64px grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative max-w-[554px] mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <span className="px-4 py-1.5 rounded-full bg-[var(--auth-primary-alpha-10)] text-[13px] leading-[18px] font-bold text-[var(--auth-primary-dark-1)]">
          Mistake Banks
        </span>
        <h2 className="max-w-[501px] text-[24px] leading-8 sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-[#101828]">
          Mistake Banks help learners review, reflect, and improve.
        </h2>
        <p className="max-w-[495px] text-[14px] leading-5 font-medium text-[#4a5565]">
          Mistake Banks collect questions learners struggle with, so they can
          revisit weak areas, build confidence, and reinforce learning over
          time.
        </p>
      </div>

      <div className="relative max-w-[937px] mx-auto px-4 pt-10 sm:pt-[52px] grid grid-cols-1 md:grid-cols-3 gap-5">
        {CARDS.map(({ image, title, description }) => (
          <div
            key={title}
            className="flex flex-col justify-between gap-6 p-5 bg-white border border-[#f3f4f6] rounded-[20px] drop-shadow-[0px_8px_12px_rgba(16,24,40,0.04)] md:min-h-[323px]">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="w-full h-[140px] rounded-xl object-cover"
            />
            <div className="flex flex-col gap-2">
              <h3 className="text-[24px] leading-8 font-bold text-[#101828]">
                {title}
              </h3>
              <p className="text-[12px] leading-4 font-medium text-[#4a5565]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
