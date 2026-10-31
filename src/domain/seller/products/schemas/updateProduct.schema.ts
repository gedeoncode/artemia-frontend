import {
  PricingSchema,
  ShippingSchema,
} from "@/schemas/product/product.schema";
import { z } from "zod";
import { buildCategorySchema } from "./categories";
import { ImageDataSchema } from "@/schemas/image.schema";

export const UpdateProductSchema = z.object({
  _id: z.string(),

  name: z.string().min(3).optional(),

  description: z.string().min(10).optional(),

  pricing: PricingSchema.partial().optional(),

  shipping: ShippingSchema.partial().optional(),

  stock: z.number().optional(),

  details: buildCategorySchema().optional(),

  images: z.array(ImageDataSchema).optional(),

  removedPublicIds: z.array(z.string()).optional(),
});
