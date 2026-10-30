import practiceIcon from "@/assets/home/process-1.svg";
import marksIcon from "@/assets/home/process-2.svg";
import fixIcon from "@/assets/home/process-3.svg";
import trackIcon from "@/assets/home/process-4.svg";

const STEPS = [
  {
    icon: practiceIcon,
    iconBg: "bg-[#e7f5fd]",
    step: "Step 01",
    title: "Practice",
    description:
      "Topic quizzes, full mocks and weak-spot sets in your exam pattern.",
  },
  {
    icon: marksIcon,
    iconBg: "bg-[#fff3c2]",
    step: "Step 02",
    title: "See where marks went",
    description: "After every test lost marks by topic and mistake type.",
  },
  {
    icon: fixIcon,
    iconBg: "bg-[#fbe0e0]",
    step: "Step 03",
    title: "Fix Your mistakes",
    description: "Fresh similar questions until each mistake is Fixed.",
  },
  {
    icon: trackIcon,
    iconBg: "bg-[#fbecfd]",
    step: "Step 04",
    title: "Track Progress",
    description: "Your syllabus map moves from Weak to Strong.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-[#fffcfa] pt-12 sm:pt-20 pb-8">
      <div className="max-w-[1024px] mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <span className="px-4 py-1.5 rounded-full bg-[var(--auth-primary-alpha-10)] text-[13px] leading-[18px] font-bold text-[var(--auth-primary-dark-1)]">
          The Process
        </span>
        <h2 className="text-[24px] leading-8 sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-[#101828]">
          From topic to mastery in minutes
        </h2>
        <p className="pt-2 text-[14px] leading-5 font-medium text-[#4a5565] max-w-[563px]">
          AI builds a personalised 3-stage quiz from any topic in seconds no
          prep needed.
        </p>
      </div>

      <div className="relative max-w-[956px] mx-auto px-4 pt-10 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-3">
        <div className="hidden lg:block absolute top-[80px] left-[36%] w-[34%] border-t-2 border-dashed border-[#f3f4f6]" />
        {STEPS.map(({ icon, iconBg, step, title, description }) => (
          <div key={step} className="relative flex flex-col items-start">
            <span
              className={`flex items-center justify-center size-16 rounded-2xl ${iconBg}`}>
              <img src={icon} alt="" width={24} height={24} />
            </span>
            <span className="pt-5 text-[12px] leading-4 font-bold text-[#08486d]">
              {step}
            </span>
            <h3 className="pt-1 text-[18px] leading-[26px] font-bold text-[#101828]">
              {title}
            </h3>
            <p className="pt-2 text-[14px] leading-5 font-medium text-[#6b7280] max-w-[248px]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
