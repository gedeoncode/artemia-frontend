"use client";

import { useQuery } from "@tanstack/react-query";
import { BaseProduct as Product } from "@/types/product/product.types";
import { logger } from "@/lib/logger";
import { productKeys } from "@/lib/react-query/product-keys";
import { getRelatedProductsApi } from "../services/client/clientProduct.services";

export function useRelatedProducts(currentProductId: string) {
  const query = useQuery<Product[], Error>({
    queryKey: productKeys.related(currentProductId),
    queryFn: async () => {
      const { data } = await getRelatedProductsApi(currentProductId);

      return data.filter((p: Product) => p._id !== currentProductId);
    },
    enabled: !!currentProductId,
    staleTime: 5 * 60 * 1000,
  });

  if (query.error) {
    logger.error("Failed to load related products:", query.error);
  }

  return {
    products: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
  };
}
