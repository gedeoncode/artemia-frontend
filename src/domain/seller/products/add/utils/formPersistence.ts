
import {
  CreateProductBaseSchema,
  type CreateProductFormSchema,
} from "../../schemas/CreateProductBase.schema";
import { createPersistence } from "./createPersistence";
const DraftSchema =
 CreateProductBaseSchema.partial();
export const productDraftPersistence =
  createPersistence<CreateProductFormSchema>({
    key: "add-product-form",
    schema: DraftSchema,
    expirationTime: 1000 * 60 * 60 * 24,
    version: 1,
  });