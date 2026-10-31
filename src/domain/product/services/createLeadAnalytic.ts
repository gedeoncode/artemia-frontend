// services/createLeadAnalytics.ts

import { serverFetch } from "@/lib/http";

export interface CreateLeadAnalyticsRequest {
  productId: string;
  contactMethod: "whatsapp" | "internal" | "email";
  source: "product_page";
}

export interface CreateLeadAnalyticsResponse {
  success: boolean;
}

export const createLeadAnalytics = async (
  data: CreateLeadAnalyticsRequest
): Promise<CreateLeadAnalyticsResponse> => {
  return await serverFetch("/api/v1/leads", {
    method: "POST",
    body: data,
  });
};