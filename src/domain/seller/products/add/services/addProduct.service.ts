import {
  CreateProductBaseSchema,
  CreateProductRequest,
  CreateProductResponseFormSchema
} from "@/domain/seller/products/schemas/CreateProductBase.schema";
import { serverFetch } from "@/lib/http";
import { SELLER_PRODUCTS_ENDPOINTS } from "../../constants/endpoints";

export const createProduct = async (
  productData: CreateProductRequest,
): Promise<CreateProductResponseFormSchema> => {
  // const parsed =
  //   CreateProductBaseSchema.safeParse(productData);
  // if (!parsed.success) {
  //   throw new Error(
  //     "Invalid product data. Please check the form fields.",
  //   );
  // }

  const payload = {
    ...productData,

    clientRequestId: crypto.randomUUID(),
  };

  return serverFetch<CreateProductResponseFormSchema>(
    SELLER_PRODUCTS_ENDPOINTS.CREATE_PRODUCT,
    {
      method: "POST",
      body: payload,
    },
  );
};

export const deleteProductImage = async (publicId: string): Promise<void> => {
  return serverFetch<void>(
    `${SELLER_PRODUCTS_ENDPOINTS.DELETE_PRODUCT_IMAGES}`,
    {
      method: "DELETE",
      body:  {publicId} ,
    },
  );
};
