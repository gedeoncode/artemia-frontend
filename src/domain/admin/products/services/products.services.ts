import {
  ProductResponse,
  FetchProductsParams,
  BulkActionType,
  RejectPayload,
} from "../types";
import { serverFetch } from "@/lib/http";

const API_BASE = "/api/admin/products";

export const fetchProducts = async (
  params?: FetchProductsParams,
): Promise<ProductResponse> => {
  const searchParams = new URLSearchParams();

  // =========================================
  // 🔹 Pagination
  // =========================================

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  // =========================================
  // 🔹 Search
  // =========================================

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  // =========================================
  // 🔹 Publication Status
  // =========================================

  if (params?.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  // =========================================
  // 🔹 Billing Status
  // =========================================

  if (params?.billingStatus && params.billingStatus !== "all") {
    searchParams.set("billingStatus", params.billingStatus);
  }

  // =========================================
  // 🔹 Inventory Status
  // =========================================

  if (params?.inventoryStatus && params.inventoryStatus !== "all") {
    searchParams.set("inventoryStatus", params.inventoryStatus);
  }

  // =========================================
  // 🔹 Optional Filters
  // =========================================

  if (params?.category) {
    searchParams.set("category", params.category);
  }

  if (params?.seller) {
    searchParams.set("seller", params.seller);
  }

  // =========================================
  // 🔹 Sorting
  // =========================================

  if (params?.sort && params.sort !== "newest") {
    searchParams.set("sort", params.sort);
  }

  // =========================================
  // 🔹 Final Query
  // =========================================

  const query = searchParams.toString();

  return serverFetch(`${API_BASE}${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};
type ProductFlagType = "featured" | "deal" | "new";

export const toggleProductFlag = async (
  id: string,
  flag: ProductFlagType,
): Promise<void> => {
  return serverFetch(`${API_BASE}/${id}/flags/${flag}`, {
    method: "PATCH",
  });
};

export const bulkProductAction = async (
  action: BulkActionType,
  payload: { ids: string[]; reject?: RejectPayload },
): Promise<void> => {
  return serverFetch(`${API_BASE}/bulk/${action}`, {
    method: "PATCH",
    body: payload,
  });
};
