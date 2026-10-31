import { ButtonVariant } from "@/components/ui";
import { CategoryNature } from "@/constants";

export const PRODUCT_ACTION = {
  BUY_NOW: "buy-now",
  ADD_TO_CART: "add-to-cart",
  CONTACT_SELLER: "contact-seller",
} as const;

export type ProductActionId =
  (typeof PRODUCT_ACTION)[keyof typeof PRODUCT_ACTION];



export interface ProductActionContext {
  productId: string;

  categoryNature: CategoryNature;

  isPurchasable: boolean;

  stock: number;
}

export interface ProductActionDefinition {
  id: ProductActionId;

  label: string;

  variant: ButtonVariant
}

export interface ResolvedProductAction extends ProductActionDefinition {
  handler: () => Promise<void> | void;
}