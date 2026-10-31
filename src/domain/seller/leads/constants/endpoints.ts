export const SELLER_LEADS_ENDPOINTS = {
  GET_ALL_LEADS: "/api/v1/seller/leads",
  GET_LEAD_BY_ID: (id: string) => `/api/v1/seller/leads/${id}`,
  UPDATE_LEAD: (id: string) => `/api/v1/seller/leads/${id}`,
};