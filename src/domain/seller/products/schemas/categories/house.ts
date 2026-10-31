import { z } from "zod";

export const HouseDetailsSchema = z.object({
  brand: z.string(),
  model: z.string().optional(),
  year: z.number().optional(),
  condition: z.enum(["neuf", "comme_neuf", "bon", "usé"]).optional(),
});
