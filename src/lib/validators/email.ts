import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email format");

export function validateEmail(email: string) {
  const result = emailSchema.safeParse(email);
  return {
    valid: result.success,
    error: result.success ? null : result.error.issues[0].message,
  };
}

export const validateEmailStrict = (email: string) => emailSchema.parse(email);
