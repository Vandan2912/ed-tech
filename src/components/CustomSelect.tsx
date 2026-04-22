import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function CustomSelect({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  options: { label: string; value: string }[];
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (open && onBlur) onBlur();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onBlur]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(
          "w-full flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-left",
          className,
        )}
      >
        <span
          className={`font-bold ${selectedOption ? "text-gray-900" : "text-gray-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#f3f4f6] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] z-50 overflow-hidden max-h-64 overflow-y-auto py-2 hideScrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="w-full flex items-center px-4 h-11 hover:bg-gray-50 transition-colors text-left"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span className="font-bold text-[#101828] text-[14px]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
