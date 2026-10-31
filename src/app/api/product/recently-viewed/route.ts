// app/api/products/recently-viewed/route.ts

import { fetchRecenttlyViewedProduct } from "@/domain/product/services";
import { withHandler } from "@/lib/http";

export const GET = withHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const ids = searchParams.get("ids");

  if (!ids) {
    throw new Error("Product ids are required");
  }

  const stored = ids.split(",");

  return await fetchRecenttlyViewedProduct(stored);
});