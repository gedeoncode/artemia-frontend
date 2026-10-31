// hooks/queries/useProductsQuery.ts

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { ProductListResponse } from "@/domain/seller/products/types/product.types";
import { productKeys } from "@/lib/react-query/product-keys";
import { ProductFilterParams } from "../types/filter.types";
import { fetchProductsApi } from "../services/client/product.client.services";

interface UseProductsQueryProps {
  initialFilterParams: ProductFilterParams;
}
export const useProductsQuery = ({
  initialFilterParams,
}: UseProductsQueryProps) => {
  const [filterParams, setFilterParams] =
    useState<ProductFilterParams>(initialFilterParams);

  const clearFilters = () => {
    setFilterParams(initialFilterParams);
  };

  const query = useQuery<ProductListResponse>({
    queryKey: productKeys.list(filterParams),
    queryFn: () => fetchProductsApi(filterParams),
  });

  return {
    products: query.data?.products ?? [],

    pagination: {
      page: query.data?.pagination.page ?? 1,
      pages: query.data?.pagination.pages ?? 1,
      total: query.data?.pagination.total ?? 0,
    },

    filterParams,
    setFilterParams,
    clearFilters,

    isLoading: query.isLoading,
    isFetching: query.isFetching,

    error: query.error instanceof Error ? query.error.message : null,

    refetch: query.refetch,
  };
};