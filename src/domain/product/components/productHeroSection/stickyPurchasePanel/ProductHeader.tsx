// components/ProductHeroSection/StickyPurchasePanel/components/ProductHeader.tsx
"use client";

import { memo } from "react";
import { Star, Heart, Share2, GitCompare } from "lucide-react";

interface ProductHeaderProps {
  name: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  sku: string;
}

export const ProductHeader = memo(function ProductHeader({
  name,
  rating,
  reviewCount,
  isFavorite,
  sku,
}: ProductHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Product Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
        {name}
      </h2>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-blue-400 text-blue-400"
                    : "fill-gray-200 text-gray-200"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {rating.toFixed(1)}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ({reviewCount.toLocaleString()} reviews)
        </span>
        <span className="text-sm text-gray-400">|</span>
        <span className="text-sm text-gray-500">SKU: {sku}</span>
      </div>

      {/* Action Buttons - Wishlist, Share, Compare */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="hidden sm:inline">Wishlist</span>
        </button>

        <button
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          aria-label="Share product"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
          aria-label="Compare product"
        >
          <GitCompare className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </button>
      </div>
    </div>
  );
});