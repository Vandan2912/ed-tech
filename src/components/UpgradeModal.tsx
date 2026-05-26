import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Check, Crown, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

const plans = {
  monthly: {
    title: "Monthly Plan",
    subtitle: "Flexible billing",
    price: "$19",
  },
  yearly: {
    title: "Yearly Plan",
    subtitle: "Save $40 per year",
    price: "$15",
  },
} as const;

const features = [
  "Unlimited AI-Generated Quizzes",
  "Priority Cognitive Load Analysis",
  "Exclusive 2026 Curriculum Access",
  "Full PDF Resource Library",
  "Personalized Learning Roadmap",
];

export function UpgradeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-gray-900/60 supports-backdrop-filter:backdrop-blur-xs duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-clip rounded-[28px] sm:rounded-[40px] border border-[#f3f4f6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] outline-none duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 hideScrollbar"
          aria-describedby={undefined}>
          {/* decorative blurred blobs */}
          <div className="pointer-events-none absolute -right-32 -top-32 size-64 rounded-full bg-[#eff6ff] opacity-50 blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-0 size-64 rounded-full bg-[#eef2ff] opacity-50 blur-3xl" />

          {/* close button */}
          <DialogPrimitive.Close className="absolute right-5 top-5 sm:right-8 sm:top-8 z-10 flex size-10 items-center justify-center rounded-full border border-[#f3f4f6] bg-[#f9fafb] text-[#6a7282] transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]">
            <X size={20} />
          </DialogPrimitive.Close>

          <div className="relative flex flex-col p-6 sm:p-12">
            {/* header */}
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-4 py-1.5 text-[10px] font-black uppercase tracking-[1.1px] text-[#155dfc]">
                <Crown size={14} />
                Upgrade to Premium
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black leading-tight tracking-[0.37px] text-[#101828]">
                Unlock Unlimited
                <br />
                <span className="text-[#155dfc]">Learning Potential</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-6 tracking-[-0.31px] text-[#6a7282]">
                Your credits have expired. Subscribe now to get unlimited AI-driven quizzes, advanced analytics, and
                priority mentor support.
              </p>
            </div>

            {/* billing toggle */}
            <div className="mx-auto mt-8 flex w-full max-w-[320px] items-center gap-0 rounded-2xl border border-[#f3f4f6] bg-[#f9fafb] p-1.25">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={cn(
                  "flex-1 h-10 rounded-[14px] text-[12px] font-black uppercase tracking-[1.2px] transition-colors",
                  billing === "monthly"
                    ? "bg-white text-[#155dfc] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                    : "text-[#99a1af]",
                )}>
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={cn(
                  "flex-1 h-10 rounded-[14px] text-[12px] font-black uppercase tracking-[1.2px] transition-colors",
                  billing === "yearly"
                    ? "bg-white text-[#155dfc] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                    : "text-[#99a1af]",
                )}>
                Yearly <span className="text-[8px] tracking-[1.4px] text-[#00c950]">-20%</span>
              </button>
            </div>

            {/* plan cards */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(["monthly", "yearly"] as const).map((key) => {
                const plan = plans[key];
                const selected = billing === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setBilling(key)}
                    className={cn(
                      "relative overflow-clip rounded-[32px] border-2 p-8 text-left transition-colors",
                      selected ? "border-[#2b7fff] bg-[#eff6ff]/30" : "border-[#f3f4f6] bg-white",
                    )}>
                    {key === "yearly" && (
                      <span className="absolute right-0 top-0 rounded-bl-[14px] bg-[#155dfc] px-4 py-1 text-[8px] font-black uppercase tracking-[1px] text-white">
                        Best Value
                      </span>
                    )}
                    <h3 className="text-lg font-black tracking-[-0.44px] text-[#101828]">{plan.title}</h3>
                    <p className="mt-1 text-sm tracking-[-0.15px] text-[#6a7282]">{plan.subtitle}</p>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-3xl font-black tracking-[0.4px] text-[#101828]">{plan.price}</span>
                      <span className="mb-1 text-sm font-bold tracking-[-0.15px] text-[#99a1af]">/mo</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* feature list */}
            <ul className="mt-8 flex flex-col gap-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#dcfce7]">
                    <Check size={12} className="text-[#00a63e]" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-bold tracking-[-0.15px] text-[#4a5565]">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              type="button"
              className="mt-8 flex h-15 w-full items-center justify-center gap-3 rounded-[24px] bg-[#155dfc] text-sm font-black uppercase tracking-[2.6px] text-white transition-colors hover:bg-[#0e44c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-2">
              <Zap size={20} fill="currentColor" />
              Activate Premium Now
            </button>
          </div>

          <DialogPrimitive.Title className="sr-only">Upgrade to Premium</DialogPrimitive.Title>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
