import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // Just a URL string
  sellerId: string;
  sellerName: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.product === item.product);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product === item.product
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          } else {
            return { items: [...state.items, item] };
          }
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product === productId ? { ...i, quantity } : i
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "artemia-cart", // stored in localStorage
    }
  )
);