import { useMemo } from "react";
import { useCartStore } from "@/stores/cartStore";

export const useCart = () => {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const summary = useMemo(() => {
    const count = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      count,
      preview: items.slice(0, 3),
      remaining: Math.max(items.length - 3, 0),
      isEmpty: items.length === 0,
    };
  }, [items]);

  return {
    cartItems: items,
    cartCount: summary.count,
    previewItems: summary.preview,
    remainingItems: summary.remaining,
    isEmpty: summary.isEmpty,

    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
};