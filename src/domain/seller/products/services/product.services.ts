// import { ProductSchema } from "@/domain/seller/products/schemas/CreateProduct.schema";
import { serverFetch } from "@/lib/http";
import { PaymentSessionResponse, Product, ProductListResponse } from "../types";
import { SELLER_PRODUCTS_ENDPOINTS } from "../constants/endpoints";
import { BulkActionParams, ProductFilterParams } from "../types/filter.types";
/* ──────────────────────────────────────────────
 *  Fetch products with query params
 * ────────────────────────────────────────────── */
export const fetchProducts = async (
  params?: ProductFilterParams,
): Promise<ProductListResponse> => {
  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return serverFetch(
    `${SELLER_PRODUCTS_ENDPOINTS.GET_ALL_PRODUCTS}?${query.toString()}`,
    {
      method: "GET",
      requireAuth: true,
    },
  );
};

/* ──────────────────────────────────────────────
 *  Bulk actions (publish, archive, delete)
 * ────────────────────────────────────────────── */
export const performBulkAction = async ({
  productIds,
  action,
}: BulkActionParams): Promise<void> => {
  await serverFetch<void>(`${SELLER_PRODUCTS_ENDPOINTS.BULK_ACTION}`, {
    method: "PATCH",
    body: { productIds, action },
  });
};

/* ──────────────────────────────────────────────
 *  Delete product
 * ────────────────────────────────────────────── */
export const deleteProduct = async (productId: string): Promise<void> => {
  await serverFetch<void>(
    `${SELLER_PRODUCTS_ENDPOINTS.SOFT_DELETE}${productId}`,
    {
      method: "PATCH",
    },
  );
};

/* ──────────────────────────────────────────────
 *  Get single product
 * ────────────────────────────────────────────── */
export const getProductById = async (productId: string): Promise<Product> => {
  const response = await serverFetch<Product>(
    `${SELLER_PRODUCTS_ENDPOINTS.GET_PRODUCT}${productId}`,
    {
      method: "GET",
    },
  );
  return response;
};

/* ──────────────────────────────────────────────
 *  Fetch payment session
 * ────────────────────────────────────────────── */
export const getPaymentSession = async (
  sessionId: string,
): Promise<PaymentSessionResponse> => {
  return serverFetch<PaymentSessionResponse>(
    `${SELLER_PRODUCTS_ENDPOINTS.GET_PAYMENT_SESSION}${sessionId}`,
    {
      method: "GET",
      requireAuth: true,
    },
  );
};
// export const createProduct = async (
//   productData: ProductFormData,
// ): Promise<CreateProductResponse> => {
//   // ✅ Validate outgoing payload
//   const parsed = ProductSchema.safeParse(productData);
//   if (!parsed.success) {
//     throw new Error("Invalid product data. Please check the form fields.");
//   }

//   const response = await serverFetch<CreateProductResponse>(
//     "/api/seller/add-product",
//     {
//       method: "POST",
//       requireAuth: true,
//       body: parsed.data,
//     },
//   );
//   // ✅ Validate response
//   const check = ProductSchema.safeParse(response);
//   if (!check.success) {
//     console.warn("⚠️ Server returned invalid product:", check.error.format());
//   }
//   return response;
// };
