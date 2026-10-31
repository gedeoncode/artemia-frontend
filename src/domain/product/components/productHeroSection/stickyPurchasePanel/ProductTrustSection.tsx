// components/ProductHeroSection/StickyPurchasePanel/components/ProductTrustSection.tsx
"use client";

import { memo } from "react";
import { Shield, Truck, RotateCcw, Award, CreditCard } from "lucide-react";
import { TrustSignal } from "../../../../types/product.types";

interface ProductTrustSectionProps {
  trustSignals: TrustSignal[];
}

export const ProductTrustSection = memo(function ProductTrustSection({
  trustSignals,
}: ProductTrustSectionProps) {
  // Default trust signals if none provided
  const defaultSignals: TrustSignal[] = [
    {
      id: "secure-checkout",
      icon: "CreditCard",
      title: "Secure Checkout",
      description: "Your payment information is secure",
    },
    {
      id: "fast-delivery",
      icon: "Truck",
      title: "Fast Delivery",
      description: "Free delivery on orders over $50",
    },
    {
      id: "returns",
      icon: "RotateCcw",
      title: "30-Day Returns",
      description: "Hassle-free returns within 30 days",
    },
    {
      id: "warranty",
      icon: "Award",
      title: "1-Year Warranty",
      description: "Manufacturer warranty included",
    },
  ];

  const signals = trustSignals.length > 0 ? trustSignals : defaultSignals;

  const iconMap = {
    CreditCard,
    Truck,
    RotateCcw,
    Award,
    Shield,
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {signals.slice(0, 4).map((signal) => {
        const Icon =
          iconMap[signal.icon as keyof typeof iconMap] || Shield;
        return (
          <div
            key={signal.id}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
          >
            <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-800">
                {signal.title}
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">
                {signal.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});