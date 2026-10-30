import type { MyBestData } from "@/api/ranks";
import rookieBadge from "@/assets/home/rookie.png";

/** Level 0 welcome banner (Figma 2094:11063). */
export function WelcomeHero({
  name,
  goal,
  best,
  onStartDiagnostic,
}: {
  name?: string;
  goal: string;
  best: MyBestData;
  onStartDiagnostic: () => void;
}) {
  const { current, required, percent } = best.progress;

  return (
    <section className="flex flex-col md:flex-row items-center gap-8 p-6 sm:p-10 overflow-hidden bg-[linear-gradient(180deg,#5f9fff_0%,#0d3b7f_50%,#002254_100%)]">
      <div className="flex flex-col items-start gap-4 flex-1 min-w-0">
        <span className="px-3 py-1 rounded-full bg-white/20 text-[12px] leading-4 font-semibold text-white whitespace-nowrap">
          Level {best.level} · New here
        </span>
        <h1 className="text-[26px] leading-[34px] sm:text-[32px] sm:leading-10 font-bold tracking-[-0.5px] text-white">
          Welcome{name ? `, ${name}` : ""}. Your {goal} journey starts today.
        </h1>
        <p className="text-[16px] leading-6 text-white opacity-92">
          You are at Level {best.level}, and that is exactly where every topper
          started. Take one 10-minute step and we will build a study plan around
          what you already know.
        </p>
        <button
          type="button"
          onClick={onStartDiagnostic}
          className="px-5 py-3 rounded-xl bg-white text-[14px] leading-5 font-semibold text-[var(--auth-primary-dark-1)] transition active:scale-[0.98]">
          Take 10-minute diagnostic
        </button>
        <p className="text-[12px] leading-4 font-medium text-white opacity-80">
          Free · No negative marking · Nobody sees your score
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 w-full md:w-[250px] shrink-0 p-6 rounded-[20px] bg-white/14 border border-white/30">
        <img
          src={rookieBadge}
          alt=""
          width={96}
          height={96}
          className="size-24 object-cover opacity-55"
        />
        <p className="text-[14px] leading-5 font-bold text-white">
          First badge: Rookie
        </p>
        <div className="w-[200px] h-2 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full min-w-2 rounded-full bg-white"
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>
        <p className="text-[12px] leading-4 font-medium text-white">
          {current} / {required} pts to Level {best.level + 1}
        </p>
      </div>
    </section>
  );
}
