// app/api/admin/categories/check-code/route.ts

import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";
import { checkCategoryCode } from "@/domain/admin/categories/create/services/createCategory.services";

export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");

  const excludeId = searchParams.get("excludeId") || undefined;

  if (!code) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "code is required",
    };
  }

  const available = await checkCategoryCode(code, excludeId);

  return {
    available,
  };
});
