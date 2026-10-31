export function buildFetchParams(
  searchParams: Record<string, string | undefined>,
  config: {
    query?: string;
    categoryId?: string;
    offerSlug?: string;
  },
) {
  return {
    page: searchParams.page ?? "1",
    limit: searchParams.limit ?? "12",

    // shared filters
    sortBy: searchParams.sortBy ?? "",
    minPrice: searchParams.minPrice ?? "",
    maxPrice: searchParams.maxPrice ?? "",

    // source-specific
    query: config.query ?? searchParams.query ?? "",
    category: config.categoryId ?? searchParams.category ?? "",
    offer: config.offerSlug ?? "",
  };
}