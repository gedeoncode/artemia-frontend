// services/client/createLeadAnalyticsApi.ts

import { clientFetch } from "@/lib/http";
import { CreateLeadAnalyticsRequest, CreateLeadAnalyticsResponse } from "../createLeadAnalytic";


export const createLeadAnalyticsApi = async (
  data: CreateLeadAnalyticsRequest
): Promise<CreateLeadAnalyticsResponse> => {
  return await clientFetch("/api/leads/analytics", {
    method: "POST",
    body: JSON.stringify(data),
  });
};