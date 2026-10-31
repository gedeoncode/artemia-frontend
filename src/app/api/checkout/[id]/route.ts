import { getCheckoutProduct } from "@/domain/checkout/services/server/chekout.services";
import { withHandler } from "@/lib/http";
import { NextRequest } from "next/server";

export const GET = withHandler(async (_req: NextRequest, { params }:{params: Promise<{
  productId: string
}>}) => {
  const {productId} = await params;

  if (!productId) {
    throw new Error("productId is required");
  }

  return await getCheckoutProduct(productId);
});
