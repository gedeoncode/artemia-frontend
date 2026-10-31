import { ProductSearchScreen } from "./components";

import { buildFetchParams } from "./utils";
import { ListingConfig } from "./types";
import { fetchListingProductsServer } from "./services/";

type Props = {
  searchParams: Record<string, string | undefined>;
  config: ListingConfig;
};

export async function ListingPage({ searchParams, config }: Props) {
  const fetchParams = buildFetchParams(searchParams, {
    query: config.query,
    categoryId: config.categoryId,
    offerSlug: config.offerSlug,
  });

  const productsData = await fetchListingProductsServer(fetchParams, {
    next: {
      tags: [
        "products",
        `category:${config.categoryId}`,
        `offer:${config.offerSlug}`,
        `search:${fetchParams.query}`,
      ],
      revalidate: 60,
    },
  });
  return (
    <ProductSearchScreen
      initialData={productsData}
      searchParams={fetchParams}
    />
  );
}
