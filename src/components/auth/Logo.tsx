import logoIcon from "@/assets/auth/logo-icon.svg";
import logoWordmark from "@/assets/auth/logo-wordmark.svg";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  iconClassName,
  wordmarkClassName,
}: {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("w-[38px] h-[35px]", iconClassName)}>
        <img src={logoIcon} alt="" className="w-full h-full" />
      </div>
      <img
        src={logoWordmark}
        alt="Mastishq.ai"
        className={cn("h-[26px] w-auto", wordmarkClassName)}
      />
    </div>
  );
}
