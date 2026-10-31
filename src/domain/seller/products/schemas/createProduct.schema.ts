import { CategoryAttribute } from "@/types";
import { CreateProductBaseSchema } from "./CreateProductBase.schema";
import { buildCategorySchema } from "./categories";



export function createProductSchema(
  attributes: CategoryAttribute[] = [],
) {
  return CreateProductBaseSchema.extend({
    details:
      buildCategorySchema(
        attributes,
      ),
  });
}

