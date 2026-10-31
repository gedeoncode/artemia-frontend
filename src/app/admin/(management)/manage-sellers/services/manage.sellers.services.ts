import { SellerResponse, SellerDocumentsResponse } from "./types";
import { getErrorMessage } from "@/errors/errorMessage";
import { apiFetch } from "@/lib/fetchLayers/apiFetch";

const API_BASE = "/api/admin/sellers";

interface FetchSellersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  commissionModel?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const fetchSellers = async (
  params?: FetchSellersParams
): Promise<SellerResponse> => {
  const query = new URLSearchParams();

  // =========================================
  // Append Query Params
  // =========================================
  Object.entries(params || {}).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        query.append(key, String(value));
      }
    }
  );

  const url = query.toString()
    ? `${API_BASE}?${query.toString()}`
    : API_BASE;

  return apiFetch<SellerResponse>(url, {
    requireAuth: true,
  });
};

export const fetchSellerDocuments = async (
  id: string,
): Promise<SellerDocumentsResponse[]> => {
  return apiFetch<SellerDocumentsResponse[]>(`${API_BASE}/${id}/documents`, {
    requireAuth: true,
  });
};

export const updateSellerStatus = async (
  id: string,
  status: string,
): Promise<SellerResponse> => {
  return apiFetch<SellerResponse>(`${API_BASE}/${id}/status`, {
    method: "PUT",
    body: { status },
    // requireAuth: true,
  });
};

export const blockSeller = async (sellerId: string): Promise<void> => {
  try {
    await apiFetch<void>(`${API_BASE}/${sellerId}/block`, {
      method: "PUT",
      requireAuth: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const unblockSeller = async (sellerId: string): Promise<void> => {
  try {
    await apiFetch<void>(`${API_BASE}/${sellerId}/unblock`, {
      method: "PUT",
      requireAuth: true,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
