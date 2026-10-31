import { serverFetch } from "@/lib/http";

import { CategoriesResponse } from "@/schemas/category.schema";

export const getSellerCategories = async (opts?: {
  signal?: AbortSignal;
}): Promise<CategoriesResponse> => {
  return serverFetch<CategoriesResponse>("/api/seller/categories", {
    method: "GET",
    signal: opts?.signal,
  });
};