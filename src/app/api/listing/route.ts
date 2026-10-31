import { fetchListingProductsServer } from "@/domain";

import { withHandler } from "@/lib/http/withHandler";


import { SearchParams } from "@/domain/listing";

export const GET = withHandler(async (req) => {
  const { searchParams } = new URL(req.url);

  const params: SearchParams = {
    query: searchParams.get("query") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  return await fetchListingProductsServer(params, {
    headers: req.headers,
  });
});