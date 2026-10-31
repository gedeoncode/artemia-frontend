import { serverFetch } from "@/lib/http";
import { OrderPayload, OrderResponse } from "../../types/types";

export const createOrder = async (
  payload: OrderPayload,
): Promise<OrderResponse> => {
  return await serverFetch("/api/user/orders", {
    method: "POST",
    body: payload,
  });
};

export const getOrderById = async (id: string) => {
 return await serverFetch(`/api/user/orders/${id}`, {
    method: "GET",
    requireAuth: true,
  });
};


export const getMyOrders = async (): Promise<OrderResponse> => {
  return await serverFetch("/api/user/orders", {
    method: "GET",
    requireAuth: true,
  });
};
