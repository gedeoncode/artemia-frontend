import { CategoryNature } from "@/constants";
import { PRODUCT_ACTION, ProductActionId } from "../types";

type ActionRule = {
  purchasable?: ProductActionId[];
  default?: ProductActionId[];
};

export const PRODUCT_ACTION_RULES: Record<CategoryNature, ActionRule> = {
  product: {
    purchasable: [
      PRODUCT_ACTION.BUY_NOW,
      PRODUCT_ACTION.ADD_TO_CART,
      PRODUCT_ACTION.CONTACT_SELLER,
    ],
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  digital: {
    purchasable: [
      PRODUCT_ACTION.BUY_NOW,
      PRODUCT_ACTION.ADD_TO_CART,
      PRODUCT_ACTION.CONTACT_SELLER,
    ],
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  vehicle: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  property: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  service: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  job: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  space: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },

  mixed: {
    default: [PRODUCT_ACTION.CONTACT_SELLER],
  },
};
