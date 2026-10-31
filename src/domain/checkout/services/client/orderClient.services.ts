import { clientFetch } from "@/lib/http";
import { OrderPayload, OrderResponse } from "../../types/types";

export const createOrderApi = async (
  payload: OrderPayload,
): Promise<OrderResponse> => {
  return await clientFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
export const fetchOrderByIdApi = async (
  id: string,
): Promise<OrderResponse> => {
  return await clientFetch(`/api/orders/${id}`, {
    method: "GET",
  });
};

export const fetchMyOrdersApi = async (): Promise<OrderResponse> => {
  return await clientFetch("/api/orders", {
    method: "GET",
  });
};