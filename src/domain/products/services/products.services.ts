import { serverFetch, ServerFetchOptions } from "@/lib/http";
import {
  HomeProductsResponse,
  ProductSectionsResponse,
} from "../../home/types";

/**
 * Fetches home page products data
 */
export const getHomeProducts = async (
  options?: ServerFetchOptions,
): Promise<HomeProductsResponse> => {
  return await serverFetch<HomeProductsResponse>(`/api/v1/homepage`, {
    method: "GET",
    requireAuth: false,
    ...options,
  });
};
export const fetchProductSections = async (
  options?: ServerFetchOptions,
): Promise<ProductSectionsResponse> => {
  return await serverFetch<ProductSectionsResponse>(
    `/api/products/product-sections`,
    {
      method: "GET",
      requireAuth: false,
      ...options,
    },
  );
};
