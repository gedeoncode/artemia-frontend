import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useCreateOrder } from "./useCreateOrder";
import { Address, ProductItem } from "../../types/types";

type PaymentMethod = "cash_on_delivery" | "mobile_money";

interface UseReviewOrderSubmissionParams {
  address: Address | null;
  cartItems: ProductItem[];
  paymentMethod: PaymentMethod;
  deliveryDate: string;
}

export function useReviewOrderSubmission({
  address,
  cartItems,
  paymentMethod,
  deliveryDate,
}: UseReviewOrderSubmissionParams) {
  const router = useRouter();

  const { submitOrder, loading, error, success } = useCreateOrder();
  const confirmOrder = useCallback(async () => {
    if (!address) {
      toast.error("Please select a delivery address");
      return;
    }

    const result = await submitOrder({
      products: cartItems,
      paymentMethod,
      deliveryDate,
      addressId: "_id" in address ? address._id : undefined,
      newAddress: !("_id" in address) ? address : undefined,
      saveNewAddress: !("_id" in address),
      setDefault: !("_id" in address),
    });

    if (result) {
      router.push("/checkout/success");

    }
  }, [address, cartItems, paymentMethod, deliveryDate, submitOrder, router]);

  return {
    confirmOrder,
    loading,
    error,
    success,
  };
}
