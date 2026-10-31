import { z } from "zod";
import { ImageDataSchema } from "../image.schema";
import { buildCategorySchema } from "@/domain/seller/products/schemas/categories";
import { ShippingSchema } from "./shipping";
import { PricingSchema } from "./pricing";
import { ProductVariantSchema } from "./variants";


/* =========================
 * Publication
 * ========================= */
export const PublicationSchema = z.object({
  status: z
    .enum([
      "draft",
      "pending_review",
      "approved",
      "rejected",
      "published",
      "archived",
    ])
    .default("draft"),

  rejectionReason: z.string().optional(),

  rejectionCode: z.string().optional(),

  internalNote: z.string().optional(),
});


/* =========================
 * Product
 * ========================= */
export const ProductSchema = z.object({
  _id: z.string().optional(),

  name: z.string().min(3, "Please enter a name with at least 3 characters."),

  description: z
    .string()
    .min(
      10,
      "Please provide a more detailed description (minimum 10 characters).",
    ),

  shortDescription: z.string().optional(),

  category: z.string().min(1, "Category is required"),

  seller: z.string().optional(),

  pricing: PricingSchema,

  images: z.array(ImageDataSchema).default([]),

  stock: z.number().int().nonnegative().default(0),

  sales: z.number().int().nonnegative().default(0),

  quantity: z.number().int().positive().default(1),

  commissionModel: z.enum(["PAP", "PAL"]).default("PAL"),

  handledBy: z.enum(["seller", "marketplace"]).default("seller"),

  shipping: ShippingSchema.optional(),

  details: buildCategorySchema().optional(),

  trackQuantity: z.boolean().default(true),

  continueSellingWhenOutOfStock: z.boolean().default(false),

  taxStatus: z.enum(["taxable", "shipping", "none"]).default("taxable"),

  publication: PublicationSchema.default({
    status: "draft",
  }),

  billingStatus: z
    .enum(["unpaid", "pending", "paid", "failed", "refunded"])
    .default("unpaid"),

  inventoryStatus: z
    .enum(["in_stock", "low_stock", "out_of_stock", "preorder"])
    .default("in_stock"),

  isFeatured: z.boolean().default(false),

  isNewArrival: z.boolean().default(false),

  variants: z.array(ProductVariantSchema).optional(),

  schemaVersion: z.number().default(1),
});

export type ProductFormSchema = z.infer<typeof ProductSchema>;
