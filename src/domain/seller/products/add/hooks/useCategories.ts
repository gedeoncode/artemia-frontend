"use client";

import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/http/client/clientFetch";
import { CategoryData } from "@/types";
import { categoryKeys } from "@/lib/react-query/category-keys";

export function useCategories() {
  const query = useQuery<CategoryData, Error>({
    queryKey: categoryKeys.all,
    queryFn: () => clientFetch("/api/seller/categories"),
    staleTime: 5 * 60 * 1000,
  });

  return {
    categories: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
