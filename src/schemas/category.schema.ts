// src/app/_schemas/categorySchema.ts
import { z } from "zod";

export const CategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parent: z.string().nullable().optional(),
  allowedModes: z.array(z.enum(["PAP", "PAL"])),
  modeRules: z
    .record(
      z.enum(["PAP", "PAL"]),
      z.object({
        commissionRate: z.number().min(0).max(1).optional(),
        minFee: z.number().optional(),
        maxFee: z.number().optional(),
      })
    )
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CategoriesResponseSchema = z.object({
  data: z.array(CategorySchema),
  
});

export type ProductCategory = z.infer<typeof CategorySchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
