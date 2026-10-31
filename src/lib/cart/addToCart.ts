import { useCartStore } from "@/stores/cartStore"; // adjust the import as needed
import { CartItem } from "@/types/cartType";

export function addToCart(
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
  },
  setShowAdded: (show: boolean) => void,
  quantity: number = 1
) {
  const item: CartItem = {
    product: product._id,
    name: product.name,
    price: product.price,
    quantity,
    image: product.images[0]?.url || "",
  };

  useCartStore.getState().addItem(item);
  setShowAdded(true);
  setTimeout(() => setShowAdded(false), 1500);
}
