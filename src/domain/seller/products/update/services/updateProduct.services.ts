/* ──────────────────────────────────────────────
 *  Update product
 * ────────────────────────────────────────────── */
export const updateProduct = async (
  productId: string,
  productData: ProductFormSchema,
): Promise<Product> => {
  const parsed = ProductSchema.safeParse(productData);
  if (!parsed.success) {
    console.error("❌ Invalid product update payload:", parsed.error.format());
    throw new Error("Invalid product update data.");
  }

  const response = await apiFetch<Product>(
    `${SELLER_PRODUCTS_ENDPOINTS.UPDATE_PRODUCT}${productId}`,
    {
      method: "PUT",
      requireAuth: true,
      body: parsed.data,
    },
  );

  const check = ProductSchema.safeParse(response);
  if (!check.success) {
    console.warn("⚠️ Invalid product update response:", check.error.format());
  }

  return response;
};
