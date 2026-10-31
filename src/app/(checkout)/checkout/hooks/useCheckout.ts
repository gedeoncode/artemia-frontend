// hooks/useCheckout.ts

import { useState } from "react";
import { createOrder } from "../service";
import { OrderPayload, OrderResponse } from "../types";
import { logger } from "@/lib/logger";

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<OrderResponse | null>(null);

  const submitOrder = async ({
    products,
    paymentMethod,
    deliveryDate,
    addressId,
    newAddress,
    saveNewAddress,
    setDefault,
  }: OrderPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await createOrder({
        products,
        paymentMethod,
        deliveryDate,
        addressId,
        newAddress,
        saveNewAddress,
        setDefault,
      });
      setSuccess(response);

      return response;
    } catch (err: unknown) {
      let message = "Checkout failed";

      message = err instanceof Error ? err.message : String(err);
      logger.error("Order submission failed", message);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitOrder,
    loading,
    error,
    success,
  };
};
