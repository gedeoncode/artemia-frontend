import { z } from "zod";


import type { ImageData } from "@/types";
import { createPersistence } from "./createPersistence";

const ImageDataSchema = z.object({
  url: z.string(),

  thumbnailUrl: z.string(),

  publicId: z.string(),

  isPrimary: z.boolean().optional(),
});

export const productImagePersistence =
  createPersistence<ImageData[]>({
    key: "add-product-images",

    schema: z.array(ImageDataSchema),

    version: 1,

    expirationTime:
      1000 * 60 * 60 * 24, // 24h
  });