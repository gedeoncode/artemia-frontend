"use client";

import { useMemo, useState } from "react";

import { debounce } from "lodash";

import { useQuery } from "@tanstack/react-query";

import { fetchProductsApi } from "@/domain/admin/products/services/client";

import { productKeys } from "@/lib/react-query/product-keys";
import { BillingStatus, InventoryStatus, ProductPublicationStatus, SortOptions } from "../types";

const PAGE_SIZE = 10;

// ======================================================
// 🔹 Publication Status
// ======================================================



export function useProducts() {
  // ======================================================
  // 🔹 Search
  // ======================================================

  const [search, setSearch] = useState("");

  // ======================================================
  // 🔹 Filters
  // ======================================================

  const [
    publicationStatus,
    setPublicationStatus,
  ] = useState<
    ProductPublicationStatus | "all"
  >("all");

  const [
    billingStatus,
    setBillingStatus,
  ] = useState<
    BillingStatus | "all"
  >("all");

  const [
    inventoryStatus,
    setInventoryStatus,
  ] = useState<
    InventoryStatus | "all"
  >("all");

  const [sort, setSort] =
    useState<SortOptions>("newest");

  // ======================================================
  // 🔹 Pagination
  // ======================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  // ======================================================
  // 🔹 Debounced Search
  // ======================================================

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);

        // Reset page on search
        setCurrentPage(1);
      }, 500),
    [],
  );

  // ======================================================
  // 🔹 Query Params
  // ======================================================

  const params = {
    page: currentPage,

    limit: PAGE_SIZE,

    ...(search && {
      search,
    }),

    ...(publicationStatus !== "all" && {
      status: publicationStatus,
    }),

    ...(billingStatus !== "all" && {
      billingStatus,
    }),

    ...(inventoryStatus !== "all" && {
      inventoryStatus,
    }),

    ...(sort && {
      sort,
    }),
  };

  // ======================================================
  // 🔹 Query
  // ======================================================

  const query = useQuery({
    queryKey: productKeys.adminList(
      params,
    ),

    queryFn: () =>
      fetchProductsApi(params),

    placeholderData: (
      previousData,
    ) => previousData,
  });

  // ======================================================
  // 🔹 Helpers
  // ======================================================

  const resetFilters = () => {
    setPublicationStatus("all");

    setBillingStatus("all");

    setInventoryStatus("all");

    setSort("newest");

    setSearch("");

    setCurrentPage(1);
  };

  const hasActiveFilters =
    publicationStatus !== "all" ||
    billingStatus !== "all" ||
    inventoryStatus !== "all" ||
    sort !== "newest" ||
    !!search;

  // ======================================================
  // 🔹 Return
  // ======================================================

  return {
    // =========================================
    // Data
    // =========================================

    products:
      query.data?.data || [],

    pagination:
      query.data?.pagination,

    totalPages:
      query.data?.pagination
        ?.totalPages || 1,

    totalProducts:
      query.data?.pagination?.total ||
      0,

    // =========================================
    // Query State
    // =========================================

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    error:
      query.error instanceof Error
        ? query.error.message
        : null,

    refetch: query.refetch,

    // =========================================
    // Search
    // =========================================

    search,

    debouncedSearch,

    // =========================================
    // Filters
    // =========================================

    publicationStatus,
    setPublicationStatus,

    billingStatus,
    setBillingStatus,

    inventoryStatus,
    setInventoryStatus,

    sort,
    setSort,

    resetFilters,

    hasActiveFilters,

    // =========================================
    // Pagination
    // =========================================

    currentPage,

    setCurrentPage,
  };
}