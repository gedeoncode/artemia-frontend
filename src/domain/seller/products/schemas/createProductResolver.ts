import { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category } from "@/types";

import { CreateProductBaseSchema, CreateProductFormSchema } from "./";
import { buildCategorySchema } from "./categories";

import { nestResolverErrors } from "./nestResolverErrors";
import { ZodSchema } from "zod";

export function createProductResolver(
  categories: Category[],
): Resolver<CreateProductFormSchema> {
  const staticResolver = zodResolver(CreateProductBaseSchema);

  return async (values, context, options) => {
    // --------------------
    // Static validation
    // --------------------

    const staticResult = await staticResolver(values, context, options);

    // --------------------
    // Dynamic validation
    // --------------------

    const category = categories.find((c) => c._id === values.category);
    const schemaCache = new Map<string, ZodSchema>();
    const key = category?._id ?? "__default__";

    let detailsSchema = schemaCache.get(key);

    if (!detailsSchema) {
      detailsSchema = buildCategorySchema(category?.attributes ?? []);

      schemaCache.set(key, detailsSchema);
    }

    const detailsResolver = zodResolver(detailsSchema);

    const detailsResult = await detailsResolver(
      values.details ?? {},
      context,
      options,
    );

    return {
      values,

      errors: {
        ...staticResult.errors,

        ...nestResolverErrors<CreateProductFormSchema>(
          "details",

          detailsResult.errors,
        ),
      },
    };
  };
}
