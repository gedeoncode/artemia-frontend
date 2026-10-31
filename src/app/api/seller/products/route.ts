import { fetchProducts } from "@/domain/seller/products/services";
import { withHandler } from "@/lib/http";
import { NextRequest } from "next/server";

export const GET = withHandler(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const params = Object.fromEntries(
    [...searchParams.entries()].filter(
      ([, value]) => value !== ""
    )
  );

  return fetchProducts(params);
});