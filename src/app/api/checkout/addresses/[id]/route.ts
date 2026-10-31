import { fetchAddressById } from "@/domain/checkout/services/server/review.services";
import { withHandler } from "@/lib/http";
import { NextRequest } from "next/server";

export const GET = withHandler(async (_req: NextRequest, { params }) => {
  const id = params?.id;

  if (!id) {
    throw new Error("productId is required");
  }

  return await fetchAddressById(id);
});
