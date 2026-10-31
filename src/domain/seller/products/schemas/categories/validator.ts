import { z } from "zod";
import {
  buildCategorySchema,
  loadCategorySchema,
} from "./index";

/**
 * Inferred type for all category detail schemas (known + generic)
 */
export type CategoryDetails = z.infer<ReturnType<typeof buildCategorySchema>>;

/**
 * Unified validator for product category details.
 *
 *  - Uses the strict discriminated union first (instant validation)
 *  - Falls back to lazy dynamic import if category is unknown
 *  - Returns structured results (success | error)
 */
export async function validateProductByCategory(
  product: any
): Promise<
  | { success: true; data: CategoryDetails }
  | { success: false; error: z.ZodError }
> {
  // Step 1 — Try the hybrid (discriminated + fallback) schema first
  const hybridSchema = buildCategorySchema();
  const result = hybridSchema.safeParse(product.details ?? product);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Step 2 — If category not found or invalid, use lazy dynamic import
  const category = product.category;
  if (!category) {
    return {
      success: false,
      error: new z.ZodError([
        { path: ["category"], message: "Missing category", code: "custom" },
      ]),
    };
  }

  try {
    const lazySchema = await loadCategorySchema(category);
    const lazyResult = lazySchema.safeParse(product.details ?? product);

    if (lazyResult.success) {
      return { success: true, data: lazyResult.data };
    }

    return { success: false, error: lazyResult.error };
  } catch (err) {
    console.error(`[Validator] Failed to validate category "${category}"`, err);
    return {
      success: false,
      error: new z.ZodError([
        {
          path: ["details"],
          message: "Unknown validation error",
          code: "custom",
        },
      ]),
    };
  }
}

// Example usage: 
// 1. backend validation
// export async function handleProductInput(product: any) {
//   const validation = await validateProductByCategory(product);

//   if (!validation.success) {
//     console.error("Invalid product data:", validation.error.format());
//     throw new Error("Product validation failed");
//   }

//   // use validated data
//   const validated = validation.data;
//   console.log("✅ Valid product:", validated);
// }

// 2. frontend validation

//const result = await validateProductByCategory(formValues);
// if (!result.success) {
//   toast.error("Please correct product details before saving");
// } else {
//   await saveProduct(result.data);
// }

