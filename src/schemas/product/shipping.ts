import { z } from "zod";

/* =========================
 * Shipping
 * ========================= */
export const ShippingSchema = z.object({
  weight: z.number().nonnegative().default(0),

  location: z.object({
    city: z.string().trim().min(2, "Ville obligatoire"),

    quartier: z.string().trim().min(2, "Quartier obligatoire"),

    avenue: z.string().trim().optional(),
  }),
});

export type Shipping = z.infer<
  typeof ShippingSchema
>;