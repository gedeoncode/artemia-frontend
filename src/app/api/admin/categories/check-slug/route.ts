// app/api/admin/categories/check-slug/route.ts

import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";
import { checkCategorySlug } from "@/domain/admin/categories/create/services/createCategory.services";

export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get("slug");

  const excludeId = searchParams.get("excludeId") || undefined;

  if (!slug) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Slug is required",
    };
  }

  const available = await checkCategorySlug(slug, excludeId);
  return {
    available,
  };
});
