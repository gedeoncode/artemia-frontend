import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";

import { fetchSellerLeads } from "@/domain/seller/leads/services/seller.lead.services";

export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || undefined;
  const contactMethod = searchParams.get("contactMethod") || undefined;

  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const page = pageParam ? Number(pageParam) : undefined;
  const limit = limitParam ? Number(limitParam) : undefined;

  const result = await fetchSellerLeads({
    status,
    contactMethod,
    page,
    limit,
  });

  return result;
});