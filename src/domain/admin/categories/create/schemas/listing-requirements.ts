import { z } from "zod";

export const listingRequirementsSchema = z
  .object({
    minImages: z.number().int().min(0).default(1),
    maxImages: z.number().int().min(1).default(10),
  })
  .refine((data) => data.maxImages >= data.minImages, {
    message: "maxImages must be greater than or equal to minImages",
    path: ["maxImages"],
  });

export type ListingRequirements = z.infer<
  typeof listingRequirementsSchema
>;