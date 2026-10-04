export function Footer() {
  return (
    <footer className="border-t border-[#f3f4f6] py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <img src="/logo.svg" alt="Mastishq.ai" className="h-5 w-auto" />

        <p className="text-[11px] font-medium text-[var(--auth-neutral-600)] whitespace-nowrap">
          © 2026 Mastishq.ai · AI-powered learning
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-[13px] font-bold text-[#99a1af] hover:text-[var(--auth-primary-dark-2)]">
            Privacy
          </a>
          <span className="w-px h-4 bg-[#e5e7eb]" />
          <a
            href="#"
            className="text-[13px] font-bold text-[#99a1af] hover:text-[var(--auth-primary-dark-2)]">
            Terms
          </a>
          <span className="w-px h-4 bg-[#e5e7eb]" />
          <a
            href="#"
            className="text-[13px] font-bold text-[#99a1af] hover:text-[var(--auth-primary-dark-2)]">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
