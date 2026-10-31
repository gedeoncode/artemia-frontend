import { serverFetch } from "@/lib/http";

import {
  GetSellerLeadResponse,
  GetSellerLeadsResponse,
  LeadFilterParams,
  UpdateLeadPayload,
  UpdateLeadResponse,
} from "../types/seller.lead.types";

import { SELLER_LEADS_ENDPOINTS } from "../constants/endpoints";

export const fetchSellerLeads = async (
  params?: LeadFilterParams,
): Promise<GetSellerLeadsResponse> => {
  const query = new URLSearchParams();

  if (params?.status) {
    query.append("status", params.status);
  }

  if (params?.contactMethod) {
    query.append("contactMethod", params.contactMethod);
  }

  if (params?.page) {
    query.append("page", String(params.page));
  }

  if (params?.limit) {
    query.append("limit", String(params.limit));
  }

  const queryString = query.toString();

  return serverFetch(
    `${SELLER_LEADS_ENDPOINTS.GET_ALL_LEADS}${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",
    },
  );
};

// Fetch single lead
export const fetchSellerLead = async (
  leadId: string,
): Promise<GetSellerLeadResponse> => {
  return serverFetch(SELLER_LEADS_ENDPOINTS.GET_LEAD_BY_ID(leadId), {
    method: "GET",
  });
};

//Update lead
export const updateLead = async (
  leadId: string,
  payload: UpdateLeadPayload,
): Promise<UpdateLeadResponse> => {
  return serverFetch(SELLER_LEADS_ENDPOINTS.UPDATE_LEAD(leadId), {
    method: "PATCH",
    requireAuth: true,
    body: payload,
  });
};
