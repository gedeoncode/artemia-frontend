import { z } from "zod";

/* =========================
 * Variants 
 * ========================= */
export const ProductVariantSchema = z.object({
  id: z.string().optional(),

  option: z.string().min(1),

  values: z.array(z.string().min(1)).nonempty(),

  sku: z.string().optional(),

  quantity: z.number().int().nonnegative().optional(),

  priceMinor: z.number().int().nonnegative().optional(),
});
