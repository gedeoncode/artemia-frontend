// domain/admin/products/components/ProductTableRow.tsx

"use client";

import Image from "next/image";

import {
  Archive,
  BadgeAlert,
  CheckCircle2,
  Clock3,
  MoreVertical,
  Star,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

import { Product } from "@/domain/admin/products/types/product.types";

import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button/Button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

import { BulkActionType, ProductFlagType, RejectPayload } from "../types";

// ======================================================
// 🔹 Publication Status Variants
// ======================================================

const PUBLICATION_STATUS_MAP = {
  approved: {
    variant: "success",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },

  pending: {
    variant: "warning",
    icon: <Clock3 className="w-3.5 h-3.5" />,
  },

  draft: {
    variant: "secondary",
    icon: <BadgeAlert className="w-3.5 h-3.5" />,
  },

  archived: {
    variant: "secondary",
    icon: <Archive className="w-3.5 h-3.5" />,
  },

  rejected: {
    variant: "danger",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
} as const;

// ======================================================
// 🔹 Inventory Status Variants
// ======================================================

const INVENTORY_STATUS_MAP = {
  in_stock: {
    variant: "success",
    label: "In Stock",
  },

  low_stock: {
    variant: "warning",
    label: "Low Stock",
  },

  out_of_stock: {
    variant: "destructive",
    label: "Out of Stock",
  },

  preorder: {
    variant: "secondary",
    label: "Preorder",
  },
} as const;

// ======================================================
// 🔹 Billing Status Variants
// ======================================================

const BILLING_STATUS_MAP = {
  paid: {
    variant: "success",
    label: "Paid",
  },

  unpaid: {
    variant: "warning",
    label: "Unpaid",
  },

  pending: {
    variant: "secondary",
    label: "Pending",
  },

  failed: {
    variant: "destructive",
    label: "Failed",
  },
} as const;

type ProductTableRowProps = {
  product: Product;

  selected: boolean;

  onToggleSelect: (id: string) => void;

  onView: (product: Product) => void;

  onSingleAction: (
    action: BulkActionType,
    id: string,
    reject?: RejectPayload,
  ) => Promise<void>;

  onReject: (product: Product) => void;

  onToggleFlag: (id: string, flag: ProductFlagType) => Promise<void>;
};

export function ProductTableRow({
  product,
  selected,
  onToggleSelect,
  onView,
  onReject,
  onSingleAction,
  onToggleFlag,
}: ProductTableRowProps) {
  const productId = product._id.toString();

  // ======================================================
  // 🔹 Derived Values
  // ======================================================

  const publicationStatus = product.publication?.status;

  const inventoryStatus = product.inventoryStatus;

  const billingStatus = product.billingStatus;

  const deal = product.pricing?.deal;

  const isDealActive = deal?.isActive;

  const finalPrice =
    isDealActive && deal?.priceMinor != null
      ? deal.priceMinor
      : product.pricing?.discountPriceMinor > 0
        ? product.pricing?.discountPriceMinor
        : product.pricing?.currentPriceMinor;

  const originalPrice = product.pricing?.originalPriceMinor;

  const currency = product.pricing?.currencyCode || "KES";

  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      {/* ===================================== */}
      {/* 🔹 Selection */}
      {/* ===================================== */}

      <td className="p-4">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(productId)}
        />
      </td>

      {/* ===================================== */}
      {/* 🔹 Product */}
      {/* ===================================== */}

      <td className="p-4">
        <div className="flex items-center gap-3">
          {product.images?.length ? (
            <Image
              src={product.images[0].thumbnailUrl || product.images[0].url}
              alt={product.name}
              width={44}
              height={44}
              loading="lazy"
              className="object-cover rounded-md border w-11 h-11"
            />
          ) : (
            <div className="w-11 h-11 rounded-md bg-muted border" />
          )}

          <div className="min-w-0">
            <button
              onClick={() => onView(product)}
              className="font-medium text-left truncate transition-colors hover:text-primary hover:underline"
            >
              {product.name}
            </button>

            <div className="flex flex-wrap items-center gap-1 mt-1">
              {product.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500" />
              )}

              {isDealActive && <Zap className="w-4 h-4 text-orange-500" />}

              {product.isNewArrival && (
                <BadgeAlert className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      </td>

      {/* ===================================== */}
      {/* 🔹 Category */}
      {/* ===================================== */}

      <td className="p-4">
        <span className="text-sm text-muted-foreground">
          {product.category?.name || "N/A"}
        </span>
      </td>

      {/* ===================================== */}
      {/* 🔹 Seller */}
      {/* ===================================== */}

      <td className="p-4">
        <span className="text-sm text-muted-foreground">
          {product.seller?.name || "N/A"}
        </span>
      </td>

      {/* ===================================== */}
      {/* 🔹 Pricing */}
      {/* ===================================== */}

      <td className="p-4 text-right">
        <div className="flex flex-col">
          <span className="font-semibold">
            {currency} {(finalPrice / 100).toLocaleString()}
          </span>

          {originalPrice > finalPrice && (
            <span className="text-xs line-through text-muted-foreground">
              {currency} {(originalPrice / 100).toLocaleString()}
            </span>
          )}
        </div>
      </td>

      {/* ===================================== */}
      {/* 🔹 Publication Status */}
      {/* ===================================== */}

      <td className="p-4">
        <Badge
          variant={
            PUBLICATION_STATUS_MAP[publicationStatus]?.variant || "secondary"
          }
          className="gap-1 capitalize"
        >
          {PUBLICATION_STATUS_MAP[publicationStatus]?.icon}

          {publicationStatus?.replace(/_/g, " ")}
        </Badge>
      </td>

      {/* ===================================== */}
      {/* 🔹 Inventory */}
      {/* ===================================== */}

      <td className="p-4">
        <Badge
          variant={
            INVENTORY_STATUS_MAP[inventoryStatus]?.variant || "secondary"
          }
        >
          {INVENTORY_STATUS_MAP[inventoryStatus]?.label}
        </Badge>
      </td>

      {/* ===================================== */}
      {/* 🔹 Billing */}
      {/* ===================================== */}

      <td className="p-4">
        <Badge
          variant={BILLING_STATUS_MAP[billingStatus]?.variant || "secondary"}
          className="gap-1"
        >
          <Wallet className="w-3 h-3" />

          {BILLING_STATUS_MAP[billingStatus]?.label}
        </Badge>
      </td>

      {/* ===================================== */}
      {/* 🔹 Actions */}
      {/* ===================================== */}

      <td className="p-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onView(product)}>
              View Details
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* ================================= */}
            {/* 🔹 Flags */}
            {/* ================================= */}

            <DropdownMenuItem
              onClick={() => onToggleFlag(productId, "featured")}
            >
              {product.isFeatured ? "Remove Featured" : "Mark as Featured"}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onToggleFlag(productId, "deal")}>
              {isDealActive ? "Remove Deal" : "Mark as Deal"}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onToggleFlag(productId, "new")}>
              {product.isNewArrival
                ? "Remove New Arrival"
                : "Mark as New Arrival"}
            </DropdownMenuItem>

            {/* ================================= */}
            {/* 🔹 Moderation */}
            {/* ================================= */}

            {publicationStatus === "pending" && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onSingleAction("approve", productId)}
                  className="text-green-600 focus:text-green-600"
                >
                  Approve Product
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onReject(product)}
                  className="text-red-600 focus:text-red-600"
                >
                  Reject Product
                </DropdownMenuItem>
              </>
            )}

            {publicationStatus === "approved" && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onSingleAction("archive", productId)}
                  className="text-red-600 focus:text-red-600"
                >
                  Archive Product
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
