import { CreditCard, Truck } from "lucide-react";

export type SellingModeValue = "PAP" | "PAL";

export interface SellingMode {
  value: SellingModeValue;
  title: string;
  description: string;
  recommended?: string;
  icon: React.ElementType;
}

/**
 * Centralized selling mode definitions shared across:
 * - Onboarding forms
 * - Seller profile settings
 * - Product listing configuration
 */
export const SELLING_MODES: readonly SellingMode[] = [
  {
    value: "PAP",
    title: "Pay at Publish (PAP)",
    description:
      "List high-value or complex products like vehicles, real estate, or services by paying a small fee. You manage everything yourself — from clients to shipping, delivery, or service execution, giving you full control over your sales.",
    recommended:
      "Choose this if you want full control and are comfortable handling clients, delivery, or services directly.",
    icon: CreditCard,
  },
  {
    value: "PAL",
    title: "Pay at Delivery (PAL)",
    description:
      "List standard products for free and let the platform handle shipping, delivery, and client management. You get paid after each successful sale, minus a commission.",
    recommended:
      "Recommended for new sellers or standard products — start easily without worrying about shipping or client management.",
    icon: Truck,
  },
] as const;
