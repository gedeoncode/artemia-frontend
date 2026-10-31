import { z } from "zod";

import { CategoryAttribute } from "@/types/category/CategoryAttribute.types";
import { evaluateCondition } from "@/domain/seller/products/add/utils";

function getBaseSchema(
  attr: CategoryAttribute,
): z.ZodTypeAny {
  switch (attr.type) {
    case "string": {
      let schema = z.string();

      if (attr.validation?.minLength) {
        schema = schema.min(
          attr.validation.minLength,
          `${attr.label} is too short`,
        );
      }

      if (attr.validation?.maxLength) {
        schema = schema.max(
          attr.validation.maxLength,
          `${attr.label} is too long`,
        );
      }

      if (attr.validation?.regex) {
        schema = schema.regex(
          new RegExp(attr.validation.regex),
          `${attr.label} format is invalid`,
        );
      }

      return schema;
    }

    case "number": {
      let schema = z.number({
        invalid_type_error: `${attr.label} must be a number`,
      });

      if (attr.validation?.min != null) {
        schema = schema.min(
          attr.validation.min,
          `${attr.label} is too small`,
        );
      }

      if (attr.validation?.max != null) {
        schema = schema.max(
          attr.validation.max,
          `${attr.label} is too large`,
        );
      }

      return schema;
    }

    case "boolean":
      return z.boolean();

    case "date":
      return z.coerce.date();

    case "enum":
      return z.string();

    case "array":
      return z.array(z.unknown());

    case "object":
      return z.record(z.string(), z.unknown());

    default:
      return z.unknown();
  }
}

function makeOptional(
  schema: z.ZodTypeAny,
  attr: CategoryAttribute,
) {
  switch (attr.type) {
    case "string":
      return z.preprocess(
        (val) =>
          val === "" ||
          val === null ||
          val === undefined
            ? undefined
            : val,
        schema.optional(),
      );

    case "number":
      return z.preprocess(
        (val) => {
          if (
            val === "" ||
            val === null ||
            val === undefined
          ) {
            return undefined;
          }

          const n = Number(val);

          return Number.isNaN(n)
            ? undefined
            : n;
        },
        schema.optional(),
      );

    default:
      return schema.optional();
  }
}

function makeRequired(
  schema: z.ZodTypeAny,
  attr: CategoryAttribute,
) {
  switch (attr.type) {
    case "string":
      return z.preprocess(
        (val) =>
          val === null ||
          val === undefined
            ? ""
            : val,
        schema.min(
          1,
          `${attr.label} est requis`,
        ),
      );

    case "number":
      return z.preprocess(
        (val) => {
          if (
            val === "" ||
            val === null ||
            val === undefined
          ) {
            return undefined;
          }

          return Number(val);
        },
        schema,
      );

    default:
      return schema;
  }
}

export function buildCategorySchema(
  attributes: CategoryAttribute[] = [],
) {
  const shape: Record<
    string,
    z.ZodTypeAny
  > = {};

  for (const attr of attributes) {
    let schema = getBaseSchema(attr);

    schema = attr.required
      ? makeRequired(schema, attr)
      : makeOptional(schema, attr);

    shape[attr.key] = schema;
  }

  return z
    .object(shape)
    .superRefine((details, ctx) => {
      for (const attr of attributes) {
        if (!attr.requiredWhen) {
          continue;
        }

        const shouldBeRequired =
          evaluateCondition(
            attr.requiredWhen,
            details,
          );

        if (!shouldBeRequired) {
          continue;
        }

        const value =
          details[
            attr.key as keyof typeof details
          ];

        const isEmpty =
          value === undefined ||
          value === null ||
          value === "";

        if (isEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [attr.key],
            message: `${attr.label} est requis`,
          });
        }
      }
    });
}