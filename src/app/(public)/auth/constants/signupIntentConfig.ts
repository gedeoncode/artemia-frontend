import { UserIntent } from "@/types";
import { ShoppingBag, Store } from "lucide-react";

export interface SignupIntentConfig {
  intent: UserIntent;
  ctaLabel: string;
  title: string;
  description: string;
  note: string;
  icon: React.ElementType;
  requiresVerification: boolean;
}

export const SIGNUP_INTENT_CONFIG: Record<UserIntent, SignupIntentConfig> = {
  [UserIntent.BROWSE]: {
    intent: UserIntent.BROWSE,
    ctaLabel: "Buy",
    title: "Buy Products",
    description: "Shop from verified sellers and place orders with confidence.",
    note: "No verification required",
    icon: ShoppingBag,
    requiresVerification: false,
  },

  [UserIntent.BECOME_SELLER]: {
    intent: UserIntent.BECOME_SELLER,
    ctaLabel: "Sell",
    title: "Sell Products",
    description: "List products, manage inventory, and get paid securely.",
    note: "Verification required to start selling",
    icon: Store,
    requiresVerification: true,
  },
} as const;
