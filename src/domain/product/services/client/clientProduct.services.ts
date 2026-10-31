import { clientFetch } from "@/lib/http";
import { BaseProduct } from "@/types/product";
export interface ProductsResponse {
  data: BaseProduct[];
}
/**
 * API Calls (Next.js routes)
 */
export const getRelatedProductsApi = async (
  currentProductId: string,
): Promise<ProductsResponse> => {
  return clientFetch(`/api/product/related/${currentProductId}`);
};
export const getRecentlyViewedApi = async (
  stored: string[],
): Promise<ProductsResponse> => {
  return clientFetch(`/api/product/recently-viewed?ids=${stored}`);
};
