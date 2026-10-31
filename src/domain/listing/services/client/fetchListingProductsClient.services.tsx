import { SearchListingProductResponse, SearchParams } from "../../types";
import { buildListingSearchParams } from "../../utils/";

export async function fetchListingProductsClient(
  params: SearchParams,
): Promise<SearchListingProductResponse> {
  const search = buildListingSearchParams(params);

  const res = await fetch(
    `/api/listing?${search.toString()}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}