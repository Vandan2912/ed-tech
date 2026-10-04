import { formatClock } from "./stages";

const SIZE = 36;
const STROKE = 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Circular per-question countdown (Figma "Circular Timer"). */
export function TimerRing({
  secondsLeft,
  totalSeconds,
}: {
  secondsLeft: number;
  totalSeconds: number;
}) {
  const fraction = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const urgent = secondsLeft <= 5;

  return (
    <div
      className="relative size-9 shrink-0"
      role="timer"
      aria-label={`${Math.ceil(secondsLeft)} seconds left`}>
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="#f0f9ff"
          stroke="#cfebfb"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={urgent ? "#fb3748" : "#139ced"}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[8px] font-medium ${
          urgent ? "text-[#fb3748]" : "text-[var(--auth-primary-dark-2)]"
        }`}>
        {formatClock(secondsLeft)}
      </span>
    </div>
  );
}
