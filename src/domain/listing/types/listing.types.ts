// domain/listing/types.ts

import { Product } from "@/types/product/product.types";

export type ListingType = "search" | "category" | "offer";

export type ListingConfig = {
  type: ListingType;

  // what drives the listing
  query?: string;
  categoryId?: string;
  offerSlug?: string;

  // UI / SEO
  title?: string;
};

export type SearchParams = {
  page?: string;
  query?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  limit?: string;
  [key: string]: string | undefined;
};

export interface Meta {
  pages: number;
  total: number;
}
export interface SearchListingProductResponse {
  success?: boolean;
  meta: Meta;
  data: Product[];
}
