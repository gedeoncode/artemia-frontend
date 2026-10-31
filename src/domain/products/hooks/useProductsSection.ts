"use client";

import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/http/client/clientFetch";

import { Section } from "@/domain/home/types";
import { productKeys } from "@/lib/react-query/product-keys";

export function useProductsSection() {
  const query = useQuery<Section[], Error>({
    queryKey: productKeys.all,
    queryFn: () => clientFetch("/api/home/products"),
    // staleTime: 5 * 60 * 1000,
  });

  return {
    products: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
