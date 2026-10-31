// ./_utils/validateProps.ts

export interface ActionButtonsProps {
  productId: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  sellerId?: string;
  sellerName?: string;
  productNature?: string; // optional in case category is missing
}