import { z } from "zod";

export const ElectronicsDetailsSchema = z.object({
  brand: z.string(),
  model: z.string().optional(),
  warranty: z.string().optional(),
  condition: z.enum(["neuf", "reconditionné", "usé"]).optional(),
  color: z.string().optional(),
});
