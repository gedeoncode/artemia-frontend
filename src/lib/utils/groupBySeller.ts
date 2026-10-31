import { CartItem } from "@/stores/cartStore";

export const groupCartItemsBySeller = (items: CartItem[]) => {
  const groups: Record<string, { sellerName: string; items: CartItem[] }> = {};
  console.log("Grouping items by seller...", items);
  if (!items || items.length === 0) {
    return [];
  }
  for (const item of items) {
    const key = item.sellerId || "unknown";

    if (!groups[key]) {
      groups[key] = {
        sellerName: item.sellerName || "Unknown Seller",
        items: [],
      };
    }

    groups[key].items.push(item);
  }

  return Object.entries(groups).map(([id, group]) => ({
    sellerId: id,
    sellerName: group.sellerName,
    items: group.items,
  }));
};
