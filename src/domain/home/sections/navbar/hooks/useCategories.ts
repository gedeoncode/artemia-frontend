"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNodeCategories,
  type CategoryNode,
} from "@/domain/home/services/nodeCategories.services";
import { categoryKeys } from "@/lib/react-query/category-keys";

const getCategories = async (parentId: string | null) => {
  const res = await fetchNodeCategories(parentId);
  return res.data;
};

export function useCategories(
  parentId: string | null = null,
  initialData: CategoryNode[],
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: categoryKeys.children(parentId),
    queryFn: () => getCategories(parentId),
    initialData: initialData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const prefetch = async (hoverParentId: string | null) => {
    const key = categoryKeys.children(hoverParentId);

    if (!queryClient.getQueryData(key)) {
      await queryClient.prefetchQuery({
        queryKey: key,
        queryFn: () => getCategories(hoverParentId),
        staleTime: 1000 * 60 * 5,
      });
    }
  };

  return {
    ...query,
    prefetch,
  };
}
