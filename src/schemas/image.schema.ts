import { z } from "zod";

/* ─────────────── Image Data ─────────────── */
export const ImageDataSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  publicId: z.string().min(1),
  isPrimary: z.boolean().optional(),
});