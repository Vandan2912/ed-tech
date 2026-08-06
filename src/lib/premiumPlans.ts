import type { BillingCycle, PremiumPlan } from "@/api/payment";

export type Billing = "monthly" | "yearly";

export const billingKeyFromCycle = (cycle: BillingCycle): Billing => (cycle === "YEARLY" ? "yearly" : "monthly");

export const billingSubtitle: Record<Billing, string> = {
  monthly: "Flexible billing",
  yearly: "Billed annually",
};

export const groupPlansByBilling = (plans: PremiumPlan[]): Partial<Record<Billing, PremiumPlan>> => {
  return plans.reduce<Partial<Record<Billing, PremiumPlan>>>((acc, plan) => {
    acc[billingKeyFromCycle(plan.billing_cycle)] = plan;
    return acc;
  }, {});
};

export const formatPrice = (price: string): string => {
  const value = Number.parseFloat(price);
  return Number.isFinite(value) ? `₹${Math.round(value)}` : price;
};

/** Rounded % saved by choosing the yearly plan over 12 months of the monthly plan. */
export const yearlySavingsPercent = (
  plans: Partial<Record<Billing, PremiumPlan>>,
): number | null => {
  const monthly = plans.monthly ? Number.parseFloat(plans.monthly.price) : NaN;
  const yearly = plans.yearly ? Number.parseFloat(plans.yearly.price) : NaN;
  if (!Number.isFinite(monthly) || !Number.isFinite(yearly) || monthly <= 0) return null;
  const percent = Math.round((1 - yearly / (monthly * 12)) * 100);
  return percent > 0 ? percent : null;
};

export const features = [
  "Unlimited AI-Generated Quizzes",
  "Priority Cognitive Load Analysis",
  "Exclusive 2026 Curriculum Access",
  "Full PDF Resource Library",
  "Personalized Learning Roadmap",
];
