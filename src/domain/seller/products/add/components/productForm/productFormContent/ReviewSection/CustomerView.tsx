// components/product/CustomerPreview.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingCart,
  Heart,
  Package,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category/category.types";
import { ImageData, Images } from "@/types";
import { Pricing, Shipping } from "@/schemas/product";
import { ListingCapabilities } from "../../../../types";
import { Button } from "@/components/ui";
import { resolveListingUx } from "@/domain/utils/listing-ux";
interface CustomerPreviewProps {
  name: string;
  description: string;

  pricing: Pricing;

  stock: number | null;

  shipping: Shipping;

  category?: Category;

  detailEntries: {
    key: string;
    fieldName: string;
    label: string;
    type: string;
    inputType?: string;
    value: unknown;
  }[];

  mainImage: ImageData;
  images: Images;

  currencyUtils: {
    format: (amount: number, currency?: string) => string;
  };
  capabilities: ListingCapabilities;

  className?: string;
}

export function CustomerPreview({
  name,
  description,

  pricing,

  stock,

  category,

  detailEntries,

  mainImage,
  images,
  currencyUtils,
  capabilities,

  className,
}: CustomerPreviewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["highlights"]),
  );
  const [imageIndex, setImageIndex] = useState(
    images.findIndex((img) => img.isPrimary) || 0,
  );
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);
  const availabilityLabel = (() => {
    switch (category?.nature) {
      case "service":
        return "Available for booking";

      case "job":
        return "Applications open";

      case "property":
        return "Available";

      case "space":
        return "Available for reservation";

      default:
        return "Available";
    }
  })();
  const hasInventory = capabilities.inventory.enabled;
  const tracksQuantity = capabilities.inventory.trackQuantity;
  const handleQuantityChange = useCallback(
    (delta: number) => {
      setQuantity((prev) => {
        const next = prev + delta;

        if (!tracksQuantity || stock == null) {
          return Math.max(1, next);
        }

        return Math.max(1, Math.min(stock, next));
      });
    },
    [tracksQuantity, stock],
  );
  const ux = resolveListingUx(category?.nature || "product", capabilities);
  const isInStock = useMemo(() => {
    if (!hasInventory) return true;
    return (stock ?? 0) > 0;
  }, [hasInventory, stock]);

  const isLowStock = useMemo(() => {
    if (!tracksQuantity) return false;
    return (stock ?? 0) <= 5 && (stock ?? 0) > 0;
  }, [tracksQuantity, stock]);

  const priceLabel = useMemo(() => {
    if (!pricing) {
      return "-";
    }

    switch (pricing.type) {
      case "fixed":
        return currencyUtils.format(
          pricing.currentPrice ?? 0,
          pricing.currencyCode,
        );

      case "negotiable":
        return (
          currencyUtils.format(
            pricing.currentPrice ?? 0,
            pricing.currencyCode,
          ) + " (Negotiable)"
        );

      case "range":
        return (
          currencyUtils.format(pricing.minPrice ?? 0, pricing.currencyCode) +
          " - " +
          currencyUtils.format(pricing.maxPrice ?? 0, pricing.currencyCode)
        );

      case "free":
        return "Free";

      default:
        return "-";
    }
  }, [pricing, currencyUtils]);

  const imageSrc = useMemo(() => {
    if (!mainImage) {
      return "/placeholder-product.jpg";
    }

    return mainImage.url ?? "/placeholder-product.jpg";
  }, [mainImage]);
  const galleryImages = useMemo(
    () => images.map((img) => img.url ?? "/placeholder-product.jpg"),
    [images],
  );

  return (
    <div className={cn("mx-auto max-w-7xl", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-8 lg:grid-cols-2"
      >
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative h-full w-full"
              >
                <Image
                  src={imageSrc}
                  alt={`${name} - View ${imageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={imageIndex === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Navigation */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setImageIndex(
                      (prev) =>
                        (prev - 1 + galleryImages.length) %
                        galleryImages.length,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImageIndex((prev) => (prev + 1) % galleryImages.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={cn(
                    "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    imageIndex === idx
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300",
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title & Rating */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                {name || "Untitled Product"}
              </h1>
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-shrink-0 rounded-full p-2 transition hover:bg-gray-100"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={cn(
                    "h-6 w-6 transition",
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400",
                  )}
                />
              </button>
            </div>
            {category && (
              <span className="inline-block mt-1 text-sm text-gray-500">
                {category.name}
              </span>
            )}
          </div>

          {/* Rating Placeholder */}
          <div className="flex items-center gap-2">
            <div className="flex text-blue-400">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
            </div>
            <span className="text-sm text-gray-500">(2,847 reviews)</span>
          </div>

          {/* Price */}
          <div>
            <span className="text-3xl font-bold text-gray-900">
              {priceLabel}
            </span>
          </div>

          {/* Stock Status */}
          {capabilities.inventory.enabled ? (
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />

                  <span className="text-sm font-medium text-green-600">
                    {availabilityLabel}
                  </span>

                  {capabilities.inventory.trackQuantity && isLowStock && (
                    <span className="text-sm text-amber-600">
                      Only {stock} left
                    </span>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />

                  <span className="text-sm font-medium text-red-600">
                    Unavailable
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />

              <span className="text-sm font-medium text-green-600">
                {availabilityLabel}
              </span>
            </div>
          )}
          {/* Product details */}
          <div className="rounded-lg border border-gray-200 p-4">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-700">
                Product Details
              </span>

              {expandedSections.has("details") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has("details") && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    {detailEntries.length > 0 ? (
                      detailEntries.map((entry) => (
                        <div
                          key={entry.key}
                          className="flex justify-between gap-4"
                        >
                          <span className="text-sm text-gray-500">
                            {entry.label}
                          </span>

                          <span className="text-sm font-medium text-gray-900 text-right">
                            {String(entry.value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional details.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {tracksQuantity && (
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 transition hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      tracksQuantity && stock != null && quantity >= stock
                    }
                    className="p-2 transition hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                type="button"
                disabled={!isInStock}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
            {tracksQuantity ? (
              <p className="text-xs text-gray-500 text-center">
                {isInStock
                  ? `${quantity} item${quantity > 1 ? "s" : ""} selected`
                  : "Notify me when available"}
              </p>
            ) : (
              <p className="text-xs text-gray-500 text-center">
                Ready to purchase
              </p>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Fast delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sticky CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg font-bold text-gray-900">
              {currencyUtils.format(pricing?.currentPrice || 0)}
            </p>
          </div>
          <Button
            type="button"
            disabled={ux.disableWhenUnavailable && !isInStock}
            className="flex flex-1 items-center"
            leftIcon={<ux.Icon className="h-4 w-4" />}
          >
            {isInStock ? ux.label : ux.unavailableLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
