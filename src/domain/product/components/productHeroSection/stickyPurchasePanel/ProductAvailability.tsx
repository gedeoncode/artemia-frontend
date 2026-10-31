// components/ProductHeroSection/StickyPurchasePanel/components/ProductAvailability.tsx
"use client";

import { memo } from "react";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { ProductAvailability as AvailabilityType } from "../../../../types/product.types";

interface ProductAvailabilityProps {
  availability: AvailabilityType;
}

export const ProductAvailability = memo(function ProductAvailability({
  availability,
}: ProductAvailabilityProps) {
  const { inStock, quantity, estimatedDelivery, expressDelivery, freeShipping } =
    availability;

  return (
    <div className="space-y-2">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
            <span className="text-sm font-medium text-green-700">
              In Stock
            </span>
            {quantity && quantity < 10 && (
              <span className="text-sm text-orange-600">
                (Only {quantity} left)
              </span>
            )}
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
            <span className="text-sm font-medium text-red-700">
              Out of Stock
            </span>
          </>
        )}
      </div>

      {/* Delivery Information */}
      <div className="space-y-1.5 text-sm">
        {freeShipping && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            <span>Free Shipping</span>
          </div>
        )}

        {estimatedDelivery && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Estimated Delivery: {estimatedDelivery}</span>
          </div>
        )}

        {expressDelivery && (
          <div className="flex items-center gap-2 text-primary-600">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Express Delivery: {expressDelivery}</span>
          </div>
        )}
      </div>
    </div>
  );
});