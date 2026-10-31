// components/ProductHeroSection/StickyPurchasePanel/components/ProductPricing.tsx
"use client";

import { AdaptedProductPrice } from "@/domain/product/types/adapted-product.types";
import { memo } from "react";

interface ProductPurchasePricingProps {
  price: AdaptedProductPrice;
}

export const ProductPurchasePricing = memo(function ProductPricing({
  price,
}: ProductPurchasePricingProps) {
  // const hasDiscount = comparePrice && comparePrice.currentPriceMinor > price.currentPriceMinor;

  return (
    <div className="flex items-end gap-3 flex-wrap">
      {/* Current Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {price?.currency}
          {price.current.toFixed(2) }
        </span>
        {price.currency &&(
          <span className="text-sm text-gray-500">{price.currency}</span>
        )}
      </div>

      {/* Compare Price (Original Price) */}
      {/* {hasDiscount && (
        <div className="flex items-baseline gap-2">
          <span className="text-lg text-gray-400 line-through">
            {comparePrice.currencyCode }
            {comparePrice.currencyCode.toFixed(2)}
          </span>
          {price.discount && (
            <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded">
              -{price.discount.percentage}%
            </span>
          )}
        </div>
      )} */}
    </div>
  );
});