
import { serverFetch, ServerFetchOptions } from "@/lib/http";
import { buildListingSearchParams } from "../../utils";
import { SearchParams } from "../../types";

export const fetchListingProductsServer = async (
  searchParams: SearchParams,
  options: ServerFetchOptions,
) => {
  const params = buildListingSearchParams(searchParams);

  return serverFetch(`/api/products/search?${params.toString()}`, {
    method: "GET",
    requireAuth: false,
    ...options,
  });
};