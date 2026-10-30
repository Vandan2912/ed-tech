import logoMark from "@/assets/home/logo-mark.svg";
import footerLogo from "@/assets/home/footer-logo.svg";

const LINKS = ["Privacy", "Terms", "Support"];

export function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] bg-white pt-8 pb-10 md:py-8">
      <div className="max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start md:items-center gap-5 md:gap-4 px-5 md:px-0">
        <img
          src={footerLogo}
          alt="Mastishq.ai"
          width={141}
          height={24}
          className="hidden md:block"
        />
        <span className="flex md:hidden items-center gap-1.5">
          <img src={logoMark} alt="" width={28} height={26} />
          <span className="text-[16px] font-extrabold text-[#060c5e]">
            Mastishq.ai
          </span>
        </span>

        <p className="text-[11px] leading-[14px] font-medium text-[#6b7280] md:text-center md:whitespace-nowrap">
          © 2026 Mastishq.AI · AI-powered learning
        </p>

        <div className="flex items-center gap-4 md:justify-self-end">
          {LINKS.map((label, i) => (
            <span key={label} className="flex items-center gap-4">
              {i > 0 && (
                <span className="hidden md:block w-px h-4 bg-[#6b7280]" />
              )}
              <a
                href="#"
                className="text-[12px] md:text-[13px] leading-[18px] font-bold text-[#6b7280] md:text-[#99a1af] hover:text-[var(--auth-primary-dark-2)]">
                {label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
