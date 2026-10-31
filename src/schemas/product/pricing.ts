import { z } from "zod";
import { DealSchema } from "./deal";
/* ============================================================
 * ENUMS
 * ============================================================
 */
export const PricingType = z.enum([
  "fixed",
  "negotiable",
  "range",
  "free",
]);

export const PricingUnit = z.enum([
  "item",
  "month",
  "day",
  "service",
  "license",
]);


/* ============================================================
 * COMMON SCHEMAS
 * ============================================================
 */

export const MoneySchema = z
  .number({
    invalid_type_error:
      "Price must be a number",
  })
  .finite()
  .nonnegative("Amount cannot be negative");
const CurrencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(3, "Invalid currency code");

/* ============================================================
 * PRICING
 * ============================================================
 */

export const PricingSchema = z
  .object({
    type: PricingType.default("fixed"),

    unit: PricingUnit.default("item"),

    currencyCode:
      CurrencyCodeSchema.default("USD"),

    currentPrice:
      MoneySchema.optional(),

    minPrice:
      MoneySchema.optional(),

    maxPrice:
      MoneySchema.optional(),

    deal: DealSchema.default({
      isActive: false,
      type: "fixed_price",
      priority: 0,
      status: "scheduled",
    }),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      /**
       * FIXED / NEGOTIABLE
       */
      case "fixed":
      case "negotiable": {
        if (data.currentPrice == null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["currentPrice"],
            message: "Price is required",
          });
        }

        if (
          data.minPrice != null ||
          data.maxPrice != null
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["type"],
            message:
              "Range pricing fields are not allowed",
          });
        }

        break;
      }

      /**
       * RANGE
       */
      case "range": {
        if (
          data.minPrice == null ||
          data.maxPrice == null
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["minPrice"],
            message:
              "Minimum and maximum prices are required",
          });
        }

        if (
          data.minPrice != null &&
          data.maxPrice != null &&
          data.maxPrice <=
            data.minPrice
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxPrice"],
            message:
              "Maximum price must be greater than minimum price",
          });
        }

        if (
          data.currentPrice != null
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["type"],
            message:
              "Fixed pricing fields are not allowed for range pricing",
          });
        }

        break;
      }

      /**
       * FREE
       */
      case "free": {
        const hasPrice =
          data.currentPrice != null ||
          data.minPrice != null ||
          data.maxPrice != null;

        if (hasPrice) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["type"],
            message:
              "Free listings cannot contain pricing values",
          });
        }

        break;
      }
    }

    /**
     * DEAL VALIDATION
     */
    if (
      data.deal.isActive &&
      data.type === "free"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deal"],
        message:
          "Free listings cannot have active deals",
      });
    }

    /**
     * DEAL PRICE MUST BE LOWER THAN LISTING PRICE
     */
    if (
      data.deal.isActive &&
      data.deal.price != null &&
      data.currentPrice != null &&
      data.deal.price >=
        data.currentPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deal", "price"],
        message:
          "Deal price must be lower than listing price",
      });
    }
  });

export type Pricing = z.infer<
  typeof PricingSchema
>;