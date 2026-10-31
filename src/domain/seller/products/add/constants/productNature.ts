import { CategoryNature } from "@/constants";
import { ListingCapabilities } from "../types";

export const LISTING_CAPABILITIES: Record<
  CategoryNature,
  ListingCapabilities
> = {
  product: {
    pricing: {
      types: ["fixed", "negotiable"],
      units: ["item"],
      supportsDeals: true,
    },

    inventory: {
      enabled: true,
      trackQuantity: true,
    },

    shipping: {
      enabled: true,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: true,
    },
  },

  vehicle: {
    pricing: {
      types: ["fixed", "negotiable"],
      units: ["item"],
      supportsDeals: false,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: true,
    },
  },

  property: {
    pricing: {
      types: ["fixed", "negotiable", "range"],
      units: ["item", "month"],
      supportsDeals: false,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: true,
    },
  },

  service: {
    pricing: {
      types: [
        "fixed",
        "negotiable",
        "range",
        "free",
      ],
      units: ["service", "day"],
      supportsDeals: true,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: false,
    },
  },

  digital: {
    pricing: {
      types: ["fixed", "free"],
      units: ["license"],
      supportsDeals: true,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: false,
    },

    location: {
      enabled: false,
      requiresAddress: false,
    },
  },

  job: {
    pricing: {
      types: ["fixed", "negotiable", "range"],
      units: ["day", "month"],
      supportsDeals: false,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: false,
    },
  },

  space: {
    pricing: {
      types: ["fixed", "negotiable", "range"],
      units: ["day", "month"],
      supportsDeals: false,
    },

    inventory: {
      enabled: false,
      trackQuantity: false,
    },

    shipping: {
      enabled: false,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: true,
    },
  },

  mixed: {
    pricing: {
      types: [
        "fixed",
        "negotiable",
        "range",
        "free",
      ],
      units: [
        "item",
        "month",
        "day",
        "service",
        "license",
      ],
      supportsDeals: true,
    },

    inventory: {
      enabled: true,
      trackQuantity: true,
    },

    shipping: {
      enabled: true,
      requiresLocation: true,
    },

    location: {
      enabled: true,
      requiresAddress: true,
    },
  },
};