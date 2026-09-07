import { cn } from "@/lib/utils";

export function GoalCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2.5 items-start justify-center text-left p-4 rounded-2xl border-2 transition-colors",
        selected
          ? "bg-[#3eaef0]/10 border-[#9ed6f8]"
          : "bg-white border-[#f3f4f6] hover:border-[#e8e8e8]",
      )}>
      <span
        className={cn(
          "text-[13px] font-bold",
          selected ? "text-[#0f80c3]" : "text-[#1e2939]",
        )}>
        {title}
      </span>
      <span
        className={cn(
          "text-[11px] font-medium leading-[14px]",
          selected ? "text-[#0c6498]" : "text-[#777777]",
        )}>
        {description}
      </span>
    </button>
  );
}
