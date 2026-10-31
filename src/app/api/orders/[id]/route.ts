import { NextRequest } from "next/server";
import { withHandler } from "@/lib/http";
import { getOrderById } from "@/domain/checkout/services/server/order.services";

export const GET = withHandler(
  async (
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;

    return await getOrderById(id);
  }
);