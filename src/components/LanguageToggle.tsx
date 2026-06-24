import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="hidden md:flex items-center bg-[#F3F4F6] border border-[#E5E7EBCC] rounded-full p-1 gap-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-[11px] font-black tracking-[0.8px] uppercase transition-all ${
          language === "en"
            ? "bg-white text-[#101828] shadow-sm"
            : "text-[#6A7282] hover:text-[#101828]"
        }`}>
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-3 py-1 rounded-full text-[12px] font-black transition-all ${
          language === "hi"
            ? "bg-white text-[#101828] shadow-sm"
            : "text-[#6A7282] hover:text-[#101828]"
        }`}>
        हिं
      </button>
    </div>
  );
}
