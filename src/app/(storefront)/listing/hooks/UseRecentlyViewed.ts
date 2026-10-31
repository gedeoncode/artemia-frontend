"use client";

import { useEffect } from "react";
import { Product } from "../types";

export function useRecentlyViewed(product: Product | null) {
  useEffect(() => {
    if (!product) return;
    const updateRecentlyViewed = () => {
      try {
        // Update the useRecentlyViewed hook to expire items after 30 days
        const storedProducts = localStorage.getItem("recentlyViewed");
        let recentProducts: Product[] = storedProducts
          ? JSON.parse(storedProducts)
          : [];

        // Remove expired items (older than 30 days)
        const now = Date.now();
        recentProducts = recentProducts.filter((p) => {
          const viewedAt = p?.viewedAt || 0;
          return now - viewedAt < 30 * 24 * 60 * 60 * 1000; // 30 days
        });

        // Add timestamp to new product
        const productWithTimestamp = { ...product, viewedAt: now };

        // Update list
        recentProducts = [
          productWithTimestamp,
          ...recentProducts.filter((p) => p._id !== product._id),
        ].slice(0, 5);

        localStorage.setItem("recentlyViewed", JSON.stringify(recentProducts));
      } catch (error) {
        console.error("Failed to update recently viewed", error);
      }
    };
    updateRecentlyViewed();
  }, [product]);
}
