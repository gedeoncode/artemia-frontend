import { z } from "zod";

export const BooksDetailsSchema = z.object({
  title: z.string(),
  author: z.string(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  language: z.string().optional(),
  pages: z.number().optional(),
  condition: z.enum(["neuf", "comme_neuf", "bon", "usé"]).optional(),
});
