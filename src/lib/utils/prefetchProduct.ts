// utils/productPrefetch.ts
// import { Product } from "@/types/productType"; // Your product type

export const prefetchProduct = async (productId?: string) => {
  if (!productId) return;

  try {
    // Next.js will cache this for client-side navigation
    await fetch(`/api/products/${productId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Prefetch failed:", error);
  }
};
