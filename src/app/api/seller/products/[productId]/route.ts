// app/api/products/[productId]/route.ts

import { deleteProduct } from "@/domain/seller/products/services";
import { withHandler } from "@/lib/http";


export const PATCH = withHandler(
  async (_, {params}:{params: Promise<{
    productId:string
  }>}) => {
    const {productId} =await params;

    if (!productId) {
      throw new Error("Product ID is required");
    }

    await deleteProduct(productId);

    return {
      success: true,
    };
  }
);