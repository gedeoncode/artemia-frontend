import { z } from "zod";

export const CarDetailsSchema = z.object({
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  mileage: z.number().optional(),
  fuelType: z.enum(["essence", "diesel", "hybride", "électrique"]).optional(),
  transmission: z.enum(["automatique", "manuelle"]).optional(),
  condition: z.enum(["neuf", "bon", "usé"]).optional(),
});
