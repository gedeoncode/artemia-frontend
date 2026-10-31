import { clientFetch } from "@/lib/http";

import {
  ProductResponse,
  FetchProductsParams,
} from "../../types";

export const fetchProductsApi =
  async (
    params?: FetchProductsParams,
  ): Promise<ProductResponse> => {
    const searchParams =
      new URLSearchParams();

    // =========================================
    // 🔹 Pagination
    // =========================================

    if (params?.page) {
      searchParams.set(
        "page",
        String(params.page),
      );
    }

    if (params?.limit) {
      searchParams.set(
        "limit",
        String(params.limit),
      );
    }

    // =========================================
    // 🔹 Search
    // =========================================

    if (params?.search?.trim()) {
      searchParams.set(
        "search",
        params.search.trim(),
      );
    }

    // =========================================
    // 🔹 Publication Status
    // =========================================

    if (
      params?.status &&
      params.status !== "all"
    ) {
      searchParams.set(
        "status",
        params.status,
      );
    }

    // =========================================
    // 🔹 Billing Status
    // =========================================

    if (
      params?.billingStatus &&
      params.billingStatus !== "all"
    ) {
      searchParams.set(
        "billingStatus",
        params.billingStatus,
      );
    }

    // =========================================
    // 🔹 Inventory Status
    // =========================================

    if (
      params?.inventoryStatus &&
      params.inventoryStatus !==
        "all"
    ) {
      searchParams.set(
        "inventoryStatus",
        params.inventoryStatus,
      );
    }

    // =========================================
    // 🔹 Sorting
    // =========================================

    if (
      params?.sort &&
      params.sort !== "newest"
    ) {
      searchParams.set(
        "sort",
        params.sort,
      );
    }

    // =========================================
    // 🔹 Optional Filters
    // =========================================

    if (params?.category) {
      searchParams.set(
        "category",
        params.category,
      );
    }

    if (params?.seller) {
      searchParams.set(
        "seller",
        params.seller,
      );
    }

    // =========================================
    // 🔹 Request
    // =========================================

    return clientFetch(
      `/api/admin/products?${searchParams.toString()}`,
    );
  };

