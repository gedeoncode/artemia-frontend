import { z } from "zod";
import { ImageDataSchema } from "@/schemas/image.schema";
import { PricingSchema, ProductVariantSchema, ShippingSchema } from "@/schemas/product";

export const CreateProductBaseSchema = z.object({
  name: z.string().min(3),

  description: z.string().min(10),

  shortDescription: z.string().optional(),

  category: z.string().min(1),

  // ================= PRICING =================
  pricing: PricingSchema,

  // ================= MEDIA =================
  images: z.array(ImageDataSchema).default([]),

  // ================= INVENTORY =================
  stock: z.number().int().nonnegative().default(0),

  trackQuantity: z.boolean().default(true),

  continueSellingWhenOutOfStock: z.boolean().default(false),

  // ================= SHIPPING =================
  shipping: ShippingSchema,

  // ================= BUSINESS =================
  commissionModel: z.enum(["PAP", "PAL"]).default("PAL"),

  handledBy: z.enum(["seller", "marketplace"]).default("seller"),

  taxStatus: z.enum(["taxable", "shipping", "none"]).default("taxable"),

  variants: z.array(ProductVariantSchema).optional(),

  removedPublicIds: z.array(z.string()).optional(),

  sessionId: z.string().optional(),
});

export const CreateProductResponseSchema = z.object({
  success: z.boolean().default(true),

  message: z.string().optional(),

  data: CreateProductBaseSchema.optional(),

  paymentSessionId: z.string().optional(),

  redirectPath: z.string().optional(),

  deferCleanup: z.boolean().default(false).optional(),
});

export type CreateProductResponseFormSchema = z.infer<
  typeof CreateProductResponseSchema
>;
export type CreateProductFormSchema = z.infer<typeof CreateProductBaseSchema>;

export const CreateProductRequestSchema =
  CreateProductBaseSchema.extend({
    clientRequestId: z.string().uuid(),
  });

export type CreateProductRequest =
  z.infer<typeof CreateProductRequestSchema>;
