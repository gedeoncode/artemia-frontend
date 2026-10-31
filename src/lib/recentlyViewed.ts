// lib/recentlyViewed.ts
import { Product } from "@/app/(storefront)/listing/types";

export function getRecentlyViewed(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedProducts = localStorage.getItem("recentlyViewed");
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Failed to parse recently viewed", error);
    return [];
  }
}

export function addToRecentlyViewed(product: Product): void {
  if (typeof window === "undefined") return;

  try {
    const recentProducts = getRecentlyViewed();
    const updatedProducts = [
      product,
      ...recentProducts.filter((p) => p._id !== product._id),
    ].slice(0, 5);
    localStorage.setItem("recentlyViewed", JSON.stringify(updatedProducts));
  } catch (error) {
    console.error("Failed to update recently viewed", error);
  }
}
