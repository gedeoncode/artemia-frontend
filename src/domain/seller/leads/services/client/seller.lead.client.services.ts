import { clientFetch } from "@/lib/http";
import { GetSellerLeadResponse, GetSellerLeadsResponse, LeadFilterParams, UpdateLeadPayload, UpdateLeadResponse } from "../../types/seller.lead.types";

export const fetchSellerLeadsApi =
  async (
    params?: LeadFilterParams,
  ): Promise<GetSellerLeadsResponse> => {
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
    // 🔹 Filters
    // =========================================

    if (params?.status && params.status ) {
      searchParams.set("status", params.status);
    }

    if (params?.contactMethod && params.contactMethod ) {
      searchParams.set("contactMethod", params.contactMethod);
    }

    // =========================================
    // 🔹 Request
    // =========================================

    const queryString = searchParams.toString();

    return clientFetch(
      `/api/seller/leads${queryString ? `?${queryString}` : ""}`,
    );
  };

  export const fetchSellerLeadApi =
  async (
    leadId: string,
  ): Promise<GetSellerLeadResponse> => {
    return clientFetch(`/api/seller/leads/${leadId}`);
  };

  export const updateLeadApi =
  async (
    leadId: string,
    payload: UpdateLeadPayload,
  ): Promise<UpdateLeadResponse> => {
    return clientFetch(`/api/seller/leads/${leadId}`, {
      method: "PATCH",
      body: payload,
    });
  };