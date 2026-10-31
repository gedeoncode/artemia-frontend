// services/checkout-storage.ts

export const CHECKOUT_REVIEW_KEY = "checkout-review";

export function clearCheckoutReview(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CHECKOUT_REVIEW_KEY);
}