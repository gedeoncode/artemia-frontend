import { z } from "zod";

export const publishingSchema = z.object({
  enabled: z.boolean().default(true),
  requiresApproval: z.boolean().default(false),
});

export type Publishing = z.infer<typeof publishingSchema>;