// app/api/admin/categories/route.ts

import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";
import {
  createCategory,
  fetchAdminCategories,
} from "@/domain/admin/categories/create/services/createCategory.services";

export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;

  const limitParam = searchParams.get("limit");

  const limit = limitParam ? Number(limitParam) : undefined;

  return fetchAdminCategories({
    status,
    limit,
  });
});

export const POST = withHandler(async (req: NextRequest) => {
  const body = await req.json();
  const result = await createCategory(body);

  return {
    statusCode: 201,
    data: result,
  };
});
