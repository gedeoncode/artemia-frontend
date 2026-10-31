import {
  CreateProductResponseFormSchema,
  CreateProductFormSchema,
} from "@/domain/seller/products/schemas";
import { clientFetch } from "@/lib/http";
type DeleteProductImageResponse = {
  success: boolean;
};
export const deleteProductImageApi = async (
  publicId: string,
): Promise<DeleteProductImageResponse> => {
  return clientFetch(
    `/api/seller/products/images/${encodeURIComponent(publicId)}`,
    {
      method: "DELETE",
    },
  );
};

export const createProductApi = async (
  productData: CreateProductFormSchema,
): Promise<CreateProductResponseFormSchema> => {
  return clientFetch("/api/seller/products/add", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};
