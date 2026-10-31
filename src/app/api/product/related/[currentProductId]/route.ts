// app/api/products/related/[currentProductId]/route.ts

import { fetchRelatedProducts } from "@/domain/product/services";
import { withHandler } from "@/lib/http";


type Params = {
  params: Promise<{
    currentProductId: string;
  }>;
};

export const GET = withHandler(async (req: Request, { params }: Params) => {
  const { currentProductId } = await params;

  if (!currentProductId) {
    throw new Error("Current product id is required");
  }

  const { searchParams } = new URL(req.url);

  const limit = Number(searchParams.get("limit") ?? 5);

  return await fetchRelatedProducts(currentProductId, limit);
});