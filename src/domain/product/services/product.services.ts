import { FetchProductByIdResponse } from "../types";
import { serverFetch } from "@/lib/http";
import { BaseProduct as Product } from "@/types/product/product.types";

export interface FetchProductsResponse {
  data: Product[];
}

export const fetchProductById = async (
  id: string,
): Promise<FetchProductByIdResponse> => {
  return await serverFetch(`/api/products/${id}`, {
    method: "GET",
  });
};

export const fetchRecenttlyViewedProduct = async (
  stored: string[],
): Promise<FetchProductsResponse> => {
  return await serverFetch(
    `/api/products/recently-viewed?ids=${stored.join(",")}`,
    {
      method: "GET",
    },
  );
};
export const fetchRelatedProducts = async (
  currentProductId: string,
  limit: number = 5,
): Promise<FetchProductsResponse> => {
  return await serverFetch(
    `/api/products/related/${currentProductId}?limit=${limit}`,
    {
      method: "GET",
    },
  );
};
