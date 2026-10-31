import { z } from "zod";

export const FashionDetailsSchema = z.object({
  brand: z.string(),
  productType: z.enum(["vetement", "chaussure", "sac", "accessoire"]),
  size: z.string().optional(),
  color: z.string().optional(),
  gender: z.enum(["homme", "femme", "enfant", "unisexe"]).optional(),
  condition: z.enum(["neuf", "comme_neuf", "bon", "usé"]).optional(),
  material: z.string().optional(),
});
