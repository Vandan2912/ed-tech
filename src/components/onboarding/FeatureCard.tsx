export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 gap-4 items-center p-5 rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] min-w-0">
      <div className="flex items-center justify-center shrink-0 size-10 rounded-[20px] bg-[#eff6ff]">
        <img src={icon} alt="" className="size-6" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#111827] truncate">
          {title}
        </p>
        <p className="text-[13px] text-[#6b7280] truncate">{description}</p>
      </div>
    </div>
  );
}
