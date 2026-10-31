"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminCategoriesApi } from "../services/client/createClientCategory.service";
import { categoryKeys } from "@/lib/react-query/category-keys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => fetchAdminCategoriesApi(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
