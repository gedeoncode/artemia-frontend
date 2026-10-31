import type { CategorySchemaType } from "./categorySchema";

export const categoryDefaultValues: CategorySchemaType = {
  name: "",
  code: "",

  parent: undefined,

  description: undefined,

  nature: "physical",

  status: "archived",

  requiresPayment: false,

  isFeatured: false,

  slug: "",

  metaTitle: undefined,

  metaDescription: undefined,

  allowedModes: ["PAL"],

  modeRules: undefined,

  homepageRules: undefined,

  image: "",

  banner: "",

  icon: "",

  publishing: {
    enabled: true,
    requiresApproval: false,
  },

  listingRequirements: {
    minImages: 1,
    maxImages: 10,
  },

  attributes: [],

  tags: [],
};