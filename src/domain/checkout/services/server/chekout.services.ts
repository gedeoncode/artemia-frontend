import { serverFetch } from "@/lib/http";
import { CheckoutProductResponse } from "../../types/chekoutProduct.types";

export const getCheckoutProduct = async (productId: string):Promise<CheckoutProductResponse> => {
  return await serverFetch(`/api/user/orders/${productId}/checkout`, {
    method: "GET",
    requireAuth: false,
  });
};