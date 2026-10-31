import {
  PRODUCT_ACTION,
  ProductActionDefinition,
  ProductActionId,
} from "../types";

export const ACTION_REGISTRY: Record<
  ProductActionId,
  ProductActionDefinition
> = {
  [PRODUCT_ACTION.BUY_NOW]: {
    id: PRODUCT_ACTION.BUY_NOW,
    label: "Buy Now",
    variant: "primary",
  },

  [PRODUCT_ACTION.ADD_TO_CART]: {
    id: PRODUCT_ACTION.ADD_TO_CART,
    label: "Add to Cart",
    variant: "outline",
  },

  [PRODUCT_ACTION.CONTACT_SELLER]: {
    id: PRODUCT_ACTION.CONTACT_SELLER,
    label: "Call Seller",
    variant: "secondary",
  },
};