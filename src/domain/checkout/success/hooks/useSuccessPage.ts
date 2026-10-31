"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { clearCheckoutReview } from "../../services/client/checkoutStorage";

export function useSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    clearCheckoutReview();
  }, []);

  const goHome = useCallback(() => {
    router.push(ROUTES.HOME);
  }, [router]);

  const goToOrders = useCallback(() => {
    router.push(ROUTES.ORDERS);
  }, [router]);

  return {
    goHome,
    goToOrders,
  };
}