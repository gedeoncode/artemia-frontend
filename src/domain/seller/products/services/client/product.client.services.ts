import { clientFetch } from "@/lib/http";
import { ProductListResponse } from "../../types";
import {
  BulkActionParams,
  ProductFilterParams,
} from "../../types/filter.types";

export const fetchProductsApi = async (
  params?: ProductFilterParams,
): Promise<ProductListResponse> => {
  const query = new URLSearchParams(
    Object.entries(params ?? {}).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = String(value);
        }

        return acc;
      },
      {} as Record<string, string>,
    ),
  );
  console.log("Query:", query);

  return clientFetch(`/api/seller/products${query.size ? `?${query}` : ""}`, {
    method: "GET",
  });
};

type SuccessResponse = {
  success: boolean;
};

export const performBulkActionApi = async (
  payload: BulkActionParams,
): Promise<SuccessResponse> => {
  return clientFetch("/api/seller/products/bulk-action", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteProductApi = async (
  productId: string,
): Promise<SuccessResponse> => {
  return clientFetch(`/api/seller/products/${encodeURIComponent(productId)}`, {
    method: "PATCH",
  });
};
