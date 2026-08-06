import { useState } from "react";
import { Check, Crown, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { plans, features } from "@/lib/premiumPlans";

type Billing = "monthly" | "yearly";

export default function AiChatPaywall({ onClose }: { onClose: () => void }) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-y-auto px-6 py-10 hideScrollbar">
      <button
        onClick={onClose}
        className="absolute right-6 top-5 w-8 h-8 rounded-[10px] bg-[#141e39] hover:bg-[#1e2939] flex items-center justify-center text-[#9ca3af] transition-colors focus-visible:outline-none"
      >
        <X size={16} />
      </button>

      <div className="w-full max-w-[574px] flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-4 py-1.5 text-[10px] font-black uppercase tracking-[1.1px] text-[#155dfc]">
          <Crown size={14} />
          Upgrade to Premium
        </span>
        <h2 className="mt-6 text-[27px] font-black leading-tight tracking-[0.28px] text-[#fafafa]">
          Unlock Unlimited
          <br />
          <span className="text-[#0b57ff]">Learning Potential</span>
        </h2>

        <div className="mt-8 flex w-full max-w-[320px] items-center gap-0 rounded-2xl border border-[#f3f4f6]/20 bg-[rgba(249,250,251,0)] p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex-1 h-10 rounded-[14px] text-[10px] font-black uppercase tracking-[1.2px] transition-colors",
              billing === "monthly"
                ? "bg-[#155dfc] text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
                : "text-[#99a1af]",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "flex-1 h-10 rounded-[14px] text-[10px] font-black uppercase tracking-[1.2px] transition-colors",
              billing === "yearly" ? "bg-[#155dfc] text-white" : "text-[#99a1af]",
            )}
          >
            Yearly <span className="text-[8px] tracking-[1.4px] text-[#00c950]">-20%</span>
          </button>
        </div>

        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {(["monthly", "yearly"] as const).map((key) => {
            const plan = plans[key];
            const selected = billing === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setBilling(key)}
                className={cn(
                  "relative overflow-clip rounded-[24px] border p-6 text-left transition-colors",
                  selected
                    ? "border-[#2c3a60] bg-[#030712]"
                    : "bg-[rgba(239,246,255,0.05)] border-[#e9f2ff]/10",
                )}
              >
                {key === "yearly" && (
                  <span className="absolute right-0 top-0 rounded-bl-[10px] bg-[#155dfc] px-3 py-1 text-[6px] font-black uppercase tracking-[1px] text-white">
                    Best Value
                  </span>
                )}
                <h3 className="text-[14px] font-black tracking-[-0.34px] text-white">{plan.title}</h3>
                <p className="mt-1 text-[10px] tracking-[-0.12px] text-[#8d8d8d]">{plan.subtitle}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-[23px] font-black tracking-[0.3px] text-white">{plan.price}</span>
                  <span className="mb-0.5 text-[10px] font-bold tracking-[-0.12px] text-white">/mo</span>
                </div>
              </button>
            );
          })}
        </div>

        <ul className="mt-8 flex w-full flex-col gap-4 text-left">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#dcfce7]">
                <Check size={12} className="text-[#00a63e]" strokeWidth={3} />
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.15px] text-[#f9f9f9]">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-8 flex h-[60px] w-full items-center justify-center gap-3 rounded-[24px] bg-[#155dfc] text-[14px] font-black uppercase tracking-[2.6px] text-white transition-colors hover:bg-[#0e44c7] focus-visible:outline-none"
        >
          <Zap size={20} fill="currentColor" />
          Activate Premium Now
        </button>
      </div>
    </div>
  );
}
