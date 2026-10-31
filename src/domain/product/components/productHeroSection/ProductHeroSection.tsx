// components/ProductHeroSection/ProductHeroSection.tsx
"use client";

import { memo } from "react";
import { StickyPurchasePanel } from "./stickyPurchasePanel/StickyPurchasePanel";
import { ProductGallery } from "../productGallery/ProductGallery"
import { AdaptedProduct } from "../../types/adapted-product.types";

interface ProductHeroSectionProps {
  product: AdaptedProduct;
  priority?: boolean;
  onAddToCart?: () => void;
}

export const ProductHeroSection = memo(function ProductHeroSection({
  product,
  onAddToCart,
}: ProductHeroSectionProps) {
  console.log("images:", product.images)
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
      {/* Product Gallery - Left Column */}
      <div className="relative">
        <ProductGallery
          images={product.images}
          title={product.name}
        />
      </div>

      {/* Sticky Purchase Panel - Right Column */}
      <div className="relative">
        <StickyPurchasePanel
          product={product}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
});