import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/auth/useAuth";
import { loadRazorpayScript, type RazorpaySuccessResponse } from "@/lib/razorpay";

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface PremiumPlan {
  id: number;
  name: string;
  price: string;
  billing_cycle: BillingCycle;
  duration_days: number;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  currentPlan: string | null;
  expiryDate: string | null;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKey: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const getPremiumPlans = async (): Promise<PremiumPlan[]> => {
  const res = await api.get<{ success: boolean; data: PremiumPlan[] }>("/payment/plans");
  return res.data?.data ?? [];
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const res = await api.get<{ success: boolean; data: SubscriptionStatus }>("/payment/subscription");
  return res.data.data;
};

export const createPaymentOrder = async (planId: number): Promise<CreateOrderResponse> => {
  const res = await api.post<{ success: boolean; data: CreateOrderResponse }>("/payment/create-order", { planId });
  return res.data.data;
};

export const verifyPayment = async (payload: VerifyPaymentPayload): Promise<void> => {
  await api.post("/payment/verify", payload);
};

/** Drives the Razorpay checkout flow: create order -> open widget -> verify payment. */
export function useRazorpayCheckout() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async (planId: number, onSuccess?: () => void) => {
    setError(null);
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setError("Couldn't load the payment gateway. Check your connection and try again.");
      setLoading(false);
      return;
    }

    let order: CreateOrderResponse;
    try {
      order = await createPaymentOrder(planId);
    } catch {
      setError("Couldn't start the payment. Please try again.");
      setLoading(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Mastishq.ai",
      description: "Premium Subscription",
      order_id: order.orderId,
      prefill: {
        name: [user?.first_name, user?.last_name].filter(Boolean).join(" "),
        email: user?.email,
        contact: user?.contact_number,
      },
      theme: { color: "#155dfc" },
      handler: async (response: RazorpaySuccessResponse) => {
        try {
          await verifyPayment(response);
          if (user) setUser({ ...user, is_premium: true });
          onSuccess?.();
        } catch {
          setError("Payment succeeded but verification failed. Contact support if you were charged.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });

    razorpay.on("payment.failed", () => {
      setError("Payment failed. Please try again.");
      setLoading(false);
    });

    razorpay.open();
  };

  return { pay, loading, error };
}
