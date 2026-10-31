import { apiFetch } from "@/lib/fetchLayers/apiFetch";

export const fetchProduct = async (id: string): Promise<ProductResponse> => {
  return await apiFetch(`/api/products/${id}`, {
    method: "GET",
  });
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await apiFetch(`/api/cart`, {
    method: "POST",
    body: { productId, quantity },
    requireAuth: true,
  });
  return response.data;
};
