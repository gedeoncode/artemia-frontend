// domain/listing/buildMetadata.ts

import { ListingConfig } from "../types";

export async function buildMetadata(config: ListingConfig) {
  switch (config.type) {
    case "search":
      return {
        title: config.query
          ? `Search "${config.query}" – Artemia`
          : "Search Products – Artemia",
        description: config.query
          ? `Browse results for ${config.query}.`
          : "Search products across categories.",
      };

    case "category":
      return {
        title: `${config.title ?? "Category"} – Artemia`,
        description: `Browse ${config.title ?? "products"} at the best prices.`,
      };

    case "offer":
      return {
        title: `${config.title ?? "Special Offers"} – Artemia`,
        description: `Discover deals in ${config.title ?? "this offer"}.`,
      };

    default:
      return {
        title: "Products – Artemia",
        description: "Browse products.",
      };
  }
}
