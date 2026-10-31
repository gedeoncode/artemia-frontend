"use client";

import { useQuery } from "@tanstack/react-query";
import { sellerKeys } from "@/lib/react-query/seller-keys";

import { SellersQueryParams } from "../types/seller-query.types";
import { fetchSellers } from "../services/manage.sellers.services";

const ITEMS_PER_PAGE = 10;

export function useSellersQuery({
  page,
  searchTerm,
  statusFilter,
}: SellersQueryParams) {
  return useQuery({
    queryKey: sellerKeys.list({
      page,
      searchTerm,
      statusFilter,
    }),

    queryFn: async () => {
      const queryParams: Record<string, string | number> = {
        page,
        limit: ITEMS_PER_PAGE,
      };

      // Search
      if (searchTerm.trim()) {
        queryParams.search = searchTerm.trim();
      }

      // Status
      if (statusFilter !== "all" && statusFilter !== "blocked") {
        queryParams.status = statusFilter;
      }

      const response = await fetchSellers(queryParams);

      const sellersData = response?.data || [];

      const paginationData = response?.pagination;

      // Client-side blocked filter
      const filteredSellers =
        statusFilter === "blocked"
          ? sellersData.filter((seller: Seller) => seller.isBlocked)
          : sellersData;

      return {
        sellers: filteredSellers,
        pagination: paginationData,
      };
    },

    placeholderData: (previousData) => previousData,
  });
}
