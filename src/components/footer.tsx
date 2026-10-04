import logoMark from "@/assets/home/logo-mark.svg";

const LINKS = ["Privacy", "Terms", "Support"];

export function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] bg-white pt-8 pb-10 md:py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-4 px-5 md:px-4">
        <img
          src="/logo.svg"
          alt="Mastishq.ai"
          className="hidden md:block h-5 w-auto"
        />
        <span className="flex md:hidden items-center gap-1.5">
          <img src={logoMark} alt="" width={28} height={26} />
          <span className="text-[16px] font-extrabold text-[#060c5e]">
            Mastishq.ai
          </span>
        </span>

        <p className="text-[11px] md:font-medium text-[#99a1af] md:text-[var(--auth-neutral-600)] md:whitespace-nowrap">
          © 2026 Mastishq.ai · AI-powered learning
        </p>

        <div className="flex items-center gap-4">
          {LINKS.map((label, i) => (
            <span key={label} className="flex items-center gap-4">
              {i > 0 && (
                <span className="hidden md:block w-px h-4 bg-[#e5e7eb]" />
              )}
              <a
                href="#"
                className="text-[12px] md:text-[13px] font-bold text-[#6b7280] md:text-[#99a1af] hover:text-[var(--auth-primary-dark-2)]">
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
