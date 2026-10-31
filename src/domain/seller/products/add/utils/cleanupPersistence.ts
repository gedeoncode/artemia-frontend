// persistenceCleanup.ts

import { productDraftPersistence } from "./formPersistence";
import { productImagePersistence } from "./imagePersistence";

export const clearAllProductPersistence = () => {
  productDraftPersistence.clear();

  productImagePersistence.clear();
};