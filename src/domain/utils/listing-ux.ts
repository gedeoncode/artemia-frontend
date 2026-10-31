// domain/listings/listing-ux.ts

import {
  ShoppingCart,
  Calendar,
  Briefcase,
  Building2,
  KeyRound,
  Download,
  LucideIcon,
} from "lucide-react";

import type { CategoryNature } from "@/constants";
import { ListingCapabilities } from "../seller/products/add/types";

export interface ListingUxConfig {
  label: string;
  unavailableLabel: string;
  Icon: LucideIcon;
  showQuantitySelector: boolean;
  showStockStatus: boolean;
  disableWhenUnavailable: boolean;
}

export function resolveListingUx(
  nature: CategoryNature,
  capabilities: ListingCapabilities,
): ListingUxConfig {
  switch (nature) {
    case "service":
      return {
        label: "Book Now",
        unavailableLabel: "Unavailable",
        Icon: Calendar,
        showQuantitySelector: false,
        showStockStatus: false,
        disableWhenUnavailable: false,
      };

    case "job":
      return {
        label: "Apply Now",
        unavailableLabel: "Closed",
        Icon: Briefcase,
        showQuantitySelector: false,
        showStockStatus: false,
        disableWhenUnavailable: false,
      };

    case "property":
      return {
        label: "Contact Agent",
        unavailableLabel: "Unavailable",
        Icon: Building2,
        showQuantitySelector: false,
        showStockStatus: false,
        disableWhenUnavailable: false,
      };

    case "space":
      return {
        label: "Reserve",
        unavailableLabel: "Unavailable",
        Icon: KeyRound,
        showQuantitySelector: false,
        showStockStatus: false,
        disableWhenUnavailable: false,
      };

    case "digital":
      return {
        label: "Get Access",
        unavailableLabel: "Unavailable",
        Icon: Download,
        showQuantitySelector: false,
        showStockStatus: false,
        disableWhenUnavailable: false,
      };

    default:
      return {
        label: "Add to Cart",
        unavailableLabel: "Out of Stock",
        Icon: ShoppingCart,
        showQuantitySelector:
          capabilities.inventory.trackQuantity,
        showStockStatus:
          capabilities.inventory.enabled,
        disableWhenUnavailable:
          capabilities.inventory.enabled,
      };
  }
}