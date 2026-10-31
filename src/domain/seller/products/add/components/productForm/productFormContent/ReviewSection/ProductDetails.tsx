"use client";

import { memo, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  DollarSign,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { CommissionModel } from "@/types/category/category.types";

import { CreateProductFormSchema } from "@/domain/seller/products/schemas";

import { Category } from "@/types";
import { ListingCapabilities } from "../../../../types";

type Pricing = CreateProductFormSchema["pricing"];

type Shipping = CreateProductFormSchema["shipping"];

interface DetailEntry {
  key: string;
  label: string;
  value: unknown;
  type?: string;
  inputType?: string;
}

interface ProductDetailsProps {
  name: string;
  description: string;

  selectedCategory?: Category;

  capabilities: ListingCapabilities;

  stock: number | null;
  trackQuantity: boolean | null;

  detailEntries: DetailEntry[];

  pricing: Pricing;
  shipping: Shipping | null;

  showFullDesc: boolean;
  toggleDescription: () => void;

  commissionModel: CommissionModel;
  commissionRate: number;

  listingFee: number;
  sellerEarns: number;

  currencyUtils: {
    format: (amount: number, currency?: string) => string;
  };

  className?: string;
}

export const ProductDetails = memo(function ProductDetails({
  name,
  description,

  selectedCategory,

  capabilities,

  stock,
  trackQuantity,

  detailEntries,

  pricing,
  shipping,

  showFullDesc,
  toggleDescription,

  commissionModel,
  commissionRate,

  listingFee,
  sellerEarns,

  currencyUtils,

  className,
}: ProductDetailsProps) {
  const [expandedSections, setExpandedSections] = useState(
    new Set(["specifications"]),
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);

      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }

      return next;
    });
  };

  const isLowStock = typeof stock === "number" && stock > 0 && stock <= 5;

  const isOutOfStock = typeof stock === "number" && stock === 0;

  const displayPrice = useMemo(() => {
    switch (pricing?.type) {
      case "range":
        return `${currencyUtils.format(
          pricing.minPrice ?? 0,
          pricing.currencyCode,
        )} - ${currencyUtils.format(
          pricing.maxPrice ?? 0,
          pricing.currencyCode,
        )}`;

      case "free":
        return "Gratuit";

      case "negotiable":
        return `${currencyUtils.format(
          pricing.currentPrice ?? 0,
          pricing.currencyCode,
        )} (Négociable)`;

      default:
        return currencyUtils.format(
          pricing.currentPrice ?? 0,
          pricing.currencyCode,
        );
    }
  }, [pricing, currencyUtils]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* HEADER */}

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {name || "Produit sans nom"}
          </h2>

          {selectedCategory && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {selectedCategory.name}
            </span>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <button
          type="button"
          onClick={toggleDescription}
          className="flex w-full items-center justify-between"
        >
          <span className="text-sm font-medium">Description</span>

          {showFullDesc ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {showFullDesc && (
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
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {description || "Aucune description"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRICING */}

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm font-medium">Tarification</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Type</span>

            <span className="capitalize">{pricing.type}</span>
          </div>

          <div className="flex justify-between">
            <span>Prix</span>

            <span className="font-semibold">{displayPrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Unité</span>

            <span>{pricing.unit}</span>
          </div>
        </div>
      </div>

      {/* INVENTORY */}

      {capabilities.inventory.enabled && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />

              <span className="text-sm font-medium">Stock</span>
            </div>

            {trackQuantity ? (
              isOutOfStock ? (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  Rupture
                </span>
              ) : isLowStock ? (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  Stock faible ({stock})
                </span>
              ) : (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {stock} en stock
                </span>
              )
            ) : (
              <span className="text-gray-500">Non suivi</span>
            )}
          </div>
        </div>
      )}

      {/* SHIPPING */}

      {capabilities.shipping.enabled && shipping && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4" />

            <span className="text-sm font-medium">Localisation</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Ville</span>

              <p className="font-medium">{shipping?.location?.city}</p>
            </div>

            <div>
              <span className="text-gray-500">Quartier</span>

              <p className="font-medium">{shipping?.location?.quartier}</p>
            </div>

            <div>
              <span className="text-gray-500">Avenue</span>

              <p className="font-medium">{shipping?.location?.avenue}</p>
            </div>
          </div>
        </div>
      )}

      {/* SPECIFICATIONS */}

      {detailEntries.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection("specifications")}
            className="flex w-full items-center justify-between p-4"
          >
            <span className="text-sm font-medium">Caractéristiques</span>

            {expandedSections.has("specifications") ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {expandedSections.has("specifications") && (
              <motion.div
                initial={{
                  height: 0,
                }}
                animate={{
                  height: "auto",
                }}
                exit={{
                  height: 0,
                }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 p-4">
                  {detailEntries.map((detail) => (
                    <div key={detail.key} className="rounded bg-gray-50 p-3">
                      <div className="text-xs text-gray-500">
                        {detail.label}
                      </div>

                      <div className="mt-1 text-sm font-medium">
                        {String(detail.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});
