// app/api/leads/analytics/route.ts

import { createLeadAnalytics } from "@/domain/product/services/createLeadAnalytic";


export async function POST(req: Request) {
  const body = await req.json();

  const result = await createLeadAnalytics(body);

  return Response.json(result);
}