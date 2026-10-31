import { z } from "zod";

import {
  CATEGORY_NATURES,
  CATEGORY_STATUSES,
} from "@/constants";

import { publishingSchema } from "./publishing";
import { listingRequirementsSchema } from "./listing-requirements";
import { attributeSchema } from "./attributes";
import { CATEGORY_MODES } from "@/constants";

const imageField = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const categorySchema = z
  .object({
    // Basic
    name: z
      .string()
      .min(2)
      .max(50)
      .regex(/^[\p{L}\p{N}\s\-&]+$/u),

    code: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .regex(/^[A-Z0-9]+(?:_[A-Z0-9]+)*$/),

    parent: z.string().nullable().optional(),

    description: z.string().max(500).optional(),

    // Commerce
    nature: z.enum(CATEGORY_NATURES),

    status: z.enum(CATEGORY_STATUSES),

    requiresPayment: z.boolean().default(false),

    isFeatured: z.boolean().default(false),

    // SEO
    slug: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

    metaTitle: z.string().max(60).optional(),

    metaDescription: z.string().max(160).optional(),

    // Rules
    allowedModes: z
      .array(z.enum(CATEGORY_MODES))
      .min(1),

    modeRules: z.record(z.any()).optional(),

    homepageRules: z.array(z.any()).optional(),

    // Media
    image: imageField,

    banner: imageField,

    icon: imageField,

    // Publishing
    publishing: publishingSchema.default({}),

    listingRequirements:
      listingRequirementsSchema.default({}),

    // Attributes
    attributes: z.array(attributeSchema).optional(),

    tags: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isFeatured && !data.image) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Featured categories must have an image",
        path: ["image"],
      });
    }
  });

export type CategorySchemaType = z.infer<
  typeof categorySchema
>;