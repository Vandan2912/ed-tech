import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/lib/validation";

/** Live checklist of password rules, ticking each one as it is satisfied. */
export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 px-1 pt-1 text-left">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value ?? "");
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold transition-colors",
              ok ? "text-[#10b981]" : "text-[#9ca3af]",
            )}>
            {ok ? (
              <Check size={14} className="shrink-0" />
            ) : (
              <span className="size-1.5 mx-1 rounded-full bg-current shrink-0" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
