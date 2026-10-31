import { NextRequest } from "next/server";
import { withHandler } from "@/lib/http";
import { createOrder, getMyOrders } from "@/domain/checkout/services/server/order.services";


export const GET = withHandler(async () => {
  return await getMyOrders();
});

export const POST = withHandler(async (req: NextRequest) => {
  const body = await req.json();

  return await createOrder(body);
});