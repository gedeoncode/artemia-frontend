import { SearchParams } from "../types";

export function buildListingSearchParams(searchParams: SearchParams) {
  const params = new URLSearchParams();

  if (searchParams.query) params.append("query", searchParams.query);
  if (searchParams.category) params.append("category", searchParams.category);
  if (searchParams.minPrice) params.append("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) params.append("maxPrice", searchParams.maxPrice);
  if (searchParams.sortBy) params.append("sortBy", searchParams.sortBy);
  if (searchParams.page) params.append("page", searchParams.page);
  if (searchParams.limit) params.append("limit", searchParams.limit);
  return params;
}
