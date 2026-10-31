"use client";

import { useQuery } from "@tanstack/react-query";
import { BaseProduct as Product } from "@/types/product/product.types";
import { useRecentlyViewedProducts } from "@/hooks/useRecentlyViewedProducts";
import { logger } from "@/lib/logger";
import { productKeys } from "@/lib/react-query/product-keys";
import { getRecentlyViewedApi } from "../services/client/clientProduct.services";

export function useRecentlyViewedSection(currentProductId: string) {
  const { ids } = useRecentlyViewedProducts();

  const query = useQuery<Product[], Error>({
    queryKey: productKeys.recentlyViewed(ids ?? []),
    queryFn: async () => {
      const { data } = await getRecentlyViewedApi(ids);

      return data.filter((p: Product) => p._id !== currentProductId);
    },
    enabled: !!ids?.length, // don’t run if no ids
    staleTime: 5 * 60 * 1000,
  });

  if (query.error) {
    logger.error("Failed to load recently viewed:", query.error);
  }

  return {
    products: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
