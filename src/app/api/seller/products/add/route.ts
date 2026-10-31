// app/api/seller/product/add/route.ts

import { NextRequest } from "next/server";
import { createProduct } from "@/domain/seller/products/add/services";
// import { CreateProductSchema } from "@/domain/seller/products/schemas";
import { withHandler } from "@/lib/http";

export const POST = withHandler(async (req: NextRequest) => {
  const body = await req.json();
  const result = await createProduct(body);

  return {
    statusCode: 201,
    data: result,
  };
});
