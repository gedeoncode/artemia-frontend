

import { CreateProductFormSchema } from "../../schemas";


export const productFormDefaults: CreateProductFormSchema = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",

  pricing: {
    type: "fixed",
    unit: "item",

    currentPrice: 0,
    minPrice: undefined,
    maxPrice: undefined,

    currencyCode: "USD",

    deal: {
      isActive: false,
      type: "fixed_price",
      label: "",
      priority: 0,

      price: undefined,
      percentage: undefined,

      status: "scheduled",
      start: undefined,
      expiry: undefined,
    },
  },

  images: [],

  stock: 0,

  commissionModel: "PAL",
  handledBy: "seller",

  shipping: {
    handoverMethod: "pickup",
    weight: 0,

    location: {
      city: "",
      quartier: "",
      avenue: "",
    },
  },

  details: {},

  trackQuantity: true,
  continueSellingWhenOutOfStock: false,

  variants: [],

  removedPublicIds: [],

  sessionId: "",
};