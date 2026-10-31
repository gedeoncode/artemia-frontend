// components/ProductHeroSection/StickyPurchasePanel/StickyPurchasePanel.tsx
"use client";

import { memo, useRef, useState, useEffect } from "react";
import { ProductAvailability } from "./ProductAvailability";
import { ProductActionPanel } from "./productActionsPanel/ProductActionsPanel";
import { ProductTrustSection } from "./ProductTrustSection";
import { SellerInformationCard } from "./SellerInformation";
import { ProductHeader } from "./ProductHeader";
import { ProductPurchasePricing } from "./ProductPurchasePricing";
import { AdaptedProduct } from "@/domain/product/types/adapted-product.types";
import { generateSku } from "@/lib";

interface StickyPurchasePanelProps {
  product: AdaptedProduct;
  onAddToCart?: () => void;
}

export const StickyPurchasePanel = memo(function StickyPurchasePanel({
  product,
}: StickyPurchasePanelProps) {
  const [isSticky, setIsSticky] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!panelRef.current) return;

      const rect = panelRef.current.getBoundingClientRect();
      const isStuck = rect.top <= 0;

      setIsSticky(isStuck);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={panelRef}
      className={`
        relative transition-all duration-200
        ${isSticky ? "sticky top-0" : ""}
      `}
    >
      <div
        className={`
          bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6
          ${isSticky ? "shadow-lg rounded-none border-x-0 border-t-0" : ""}
        `}
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Product Header */}
          <ProductHeader
            name={product.name}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isFavorite={product.isFavorite}
            sku={generateSku(product.id)}
          />

          <hr className="border-gray-200" />

          {/* Product Pricing */}
          <ProductPurchasePricing price={product.price} />

          {/* Product Availability */}
          <ProductAvailability availability={product.availability} />

          {/* Product Actions */}
          <ProductActionPanel product={product}  />

          {/* Trust Signals */}
          {/* <ProductTrustSection trustSignals={product.trustSignals} /> */}

          <hr className="border-gray-200" />

          {/* Seller Information */}
          <SellerInformationCard seller={product.seller} />
        </div>
      </div>
    </div>
  );
});
