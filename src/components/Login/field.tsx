/* Reusable form field with label + error */

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-red-500 text-xs font-semibold">{error}</span>
      )}
    </div>
  );
}
