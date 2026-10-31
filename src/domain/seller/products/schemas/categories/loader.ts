import { z } from "zod";
import type { CategoryKey } from "./index";
import { GenericDetailsSchema } from "./index";

/**
 * Type signature for a lazily loaded category module.
 */
type CategoryModule = { [key: string]: z.ZodSchema<any> };

/**
 * Dynamic import map for known category modules.
 * ⚠️ You can later generate this list automatically (via codegen).
 */
const categoryModuleMap: Record<CategoryKey, () => Promise<CategoryModule>> = {
  car: () => import("./car"),
  house: () => import("./house"),
  electronics: () => import("./electronics"),
  books: () => import("./books"),
  fashion: () => import("./fashion"),
};

/**
 * Loads a specific category schema dynamically.
 */
export async function loadCategorySchema(category: string) {
  try {
    if (category in categoryModuleMap) {
      const module = await categoryModuleMap[category as CategoryKey]();
      const schemaKey = Object.keys(module).find((k) =>
        k.endsWith("DetailsSchema")
      );
      return schemaKey
        ? (module[schemaKey] as z.ZodSchema<any>)
        : GenericDetailsSchema;
    }
    return GenericDetailsSchema;
  } catch (error) {
    console.warn(
      `[SchemaLoader] Failed to load category "${category}". Using generic schema., Error:`, error
    );
    return GenericDetailsSchema;
  }
}
