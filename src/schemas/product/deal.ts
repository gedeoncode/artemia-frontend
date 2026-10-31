import { z } from "zod";

 const MoneySchema = z
  .number({
    invalid_type_error:
      "Price must be a number",
  })
  .finite()
  .nonnegative("Amount cannot be negative");
/* =========================
 * Pricing
 * ========================= */
export const DealType = z.enum([
  "fixed_price",
  "percentage",
  "clearance",
  "flash_sale",
]);

export const DealStatus = z.enum([
  "scheduled",
  "active",
  "expired",
  "paused",
]);

/* ============================================================
 * DEAL
 * ============================================================
 */

export const DealSchema = z
  .object({
    isActive: z.boolean().default(false),

    type: DealType.default("fixed_price"),

    label: z
      .string()
      .trim()
      .max(50, "Label cannot exceed 50 characters")
      .optional(),

    priority: z
      .number()
      .int()
      .min(0)
      .max(100)
      .default(0),

    price: MoneySchema.optional(),

    percentage: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    start: z.date().optional(),

    expiry: z.date().optional(),

    status: DealStatus.default("scheduled"),
  })
  .superRefine((deal, ctx) => {
    if (!deal.isActive) return;

    switch (deal.type) {
      case "fixed_price": {
        if (deal.price == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["price"],
            message: "Deal price is required",
          });
        }
        break;
      }

      case "percentage": {
        if (deal.percentage == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["percentage"],
            message: "Discount percentage is required",
          });
        }

        if (
          deal.percentage != null &&
          deal.percentage >= 100
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["percentage"],
            message:
              "Discount percentage must be less than 100",
          });
        }

        break;
      }
    }

    if (
      deal.start &&
      deal.expiry &&
      deal.expiry <= deal.start
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiry"],
        message:
          "Expiry date must be after start date",
      });
    }
  });
