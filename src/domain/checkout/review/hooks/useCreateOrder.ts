import { useMutation } from "@tanstack/react-query";
import { logger } from "@/lib/logger";
import { createOrderApi } from "../../services/client/orderClient.services";
import { OrderPayload, OrderResponse } from "../../types/types";

export const useCreateOrder = () => {
  const mutation = useMutation<OrderResponse, Error, OrderPayload>({
    mutationFn: createOrderApi,

    onError: (error) => {
      logger.error("Order submission failed", error.message);
    },
  });

  return {
    submitOrder: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    success: mutation.data ?? null,
    reset: mutation.reset,
  };
};
