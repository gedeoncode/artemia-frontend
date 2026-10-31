import { useCart } from "@/hooks/useCart";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { clearCheckoutReview } from "../../services/client/checkoutStorage";

interface UseCheckoutNotificationsParams {
  success: boolean;
  error: string | null;
}

export function useCheckoutNotifications({
  success,
  error,
}: UseCheckoutNotificationsParams) {
   const {clearCart} = useCart()
  const hasShownSuccess = useRef(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!success || hasShownSuccess.current) {
      return;
    }

    hasShownSuccess.current = true;

    toast.success("Order placed successfully!");
   clearCheckoutReview()
    clearCart()

  }, [success, clearCart]);
}