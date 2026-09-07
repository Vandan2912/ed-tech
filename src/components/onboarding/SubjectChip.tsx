import { cn } from "@/lib/utils";

export function SubjectChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-[14px] border-2 text-[11px] font-semibold capitalize transition-colors whitespace-nowrap",
        selected
          ? "bg-[#cfebfb] border-[#139ced] text-[#08486d]"
          : "bg-[#f9fafb] border-[#f3f4f6] text-[#4a5565] hover:border-[#e8e8e8]",
      )}>
      {label}
    </button>
  );
}
