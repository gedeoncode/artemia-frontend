import { NextRequest } from "next/server";
import { withHandler } from "@/lib/http";
import { BulkActionParams } from "@/domain/seller/products/types/filter.types";
import { performBulkAction } from "@/domain/seller/products/services";

export const PATCH = withHandler(async (req: NextRequest) => {
  const body: BulkActionParams = await req.json();

  await performBulkAction(body);

  return {
    success: true,
  };
});
