import { Dialog as DialogPrimitive } from "radix-ui";
import { Download, Share2, Trophy, X, type LucideIcon } from "lucide-react";

export interface CertificateData {
  subject: string;
  grade: string;
  date: string | null;
  completed: number;
  total: number;
  icon: LucideIcon;
  /** CSS gradient for the footer issuer icon background */
  gradient: string;
  /** CSS gradient applied to the subject title text */
  titleGradient: string;
}

export function CertificateModal({
  open,
  onOpenChange,
  certificate,
  recipient,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateData | null;
  recipient: string;
}) {
  if (!certificate) return null;

  const Icon = certificate.icon;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-900/60 supports-backdrop-filter:backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[768px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] outline-none duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 hideScrollbar"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Close className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full border border-[#f3f4f6] bg-[#f9fafb] text-[#6a7282] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]">
            <X size={18} />
          </DialogPrimitive.Close>

          <div className="flex flex-col items-center px-8 pb-12 pt-16 sm:px-16">
            {/* Seal */}
            <div
              className="flex size-16 items-center justify-center rounded-[16px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(255, 185, 0) 0%, rgb(254, 154, 0) 100%)",
              }}
            >
              <Trophy size={36} className="text-white" />
            </div>
            <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.6px] text-[#6a7282]">
              Certificate of Achievement
            </p>
            <div className="mt-6 h-px w-16 bg-[#e5e7eb]" />

            {/* Body */}
            <p className="mt-12 text-[14px] tracking-[-0.15px] text-[#4a5565]">
              This is to certify that
            </p>
            <p className="mt-4 text-[36px] font-semibold leading-[40px] tracking-[0.37px] text-[#101828]">
              {recipient}
            </p>
            <p className="mt-7 text-[14px] tracking-[-0.15px] text-[#4a5565]">
              has successfully completed
            </p>
            <p
              className="mt-4 bg-clip-text text-[24px] font-semibold leading-[32px] tracking-[0.07px] text-transparent"
              style={{ backgroundImage: certificate.titleGradient }}
            >
              {certificate.subject}
            </p>
            <p className="mt-7 text-[14px] tracking-[-0.15px] text-[#4a5565]">
              with a grade of{" "}
              <span className="text-[20px] font-semibold tracking-[-0.45px] text-[#101828]">
                {certificate.grade}
              </span>
            </p>

            {/* Footer meta */}
            <div className="mt-12 flex w-full items-center justify-between border-t border-[#f3f4f6] pt-8">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-[#6a7282]">Date</span>
                <span className="text-[14px] font-medium tracking-[-0.15px] text-[#101828]">
                  {certificate.date ?? "—"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-12 items-center justify-center rounded-[14px]"
                  style={{ backgroundImage: certificate.gradient }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-[12px] text-[#6a7282]">Mastishq.ai</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[12px] text-[#6a7282]">Topics</span>
                <span className="text-[14px] font-medium tracking-[-0.15px] text-[#101828]">
                  {certificate.completed}/{certificate.total}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex w-full gap-3">
              <button
                type="button"
                className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#101828] text-[14px] font-medium tracking-[-0.15px] text-white transition-colors hover:bg-[#1d2939] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-2"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                type="button"
                className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#e5e7eb] text-[14px] font-medium tracking-[-0.15px] text-[#364153] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <DialogPrimitive.Title className="sr-only">
            {certificate.subject} Certificate
          </DialogPrimitive.Title>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
