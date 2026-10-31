export type PricingType = "fixed" | "negotiable" | "range" | "free";
export type PricingUnit = "item" | "month" | "day" | "service" | "license";
export interface ListingCapabilities {
  pricing: {
    types: PricingType[];

    units: (PricingUnit)[];

    supportsDeals: boolean;
  };

  inventory: {
    enabled: boolean;
    trackQuantity: boolean;
  };

  shipping: {
    enabled: boolean;
    requiresLocation: boolean;
  };

  location: {
    enabled: boolean;
    requiresAddress: boolean;
  };
}
