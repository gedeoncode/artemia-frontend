import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";

import {
  fetchSellerLead,
  updateLead,
} from "@/domain/seller/leads/services/seller.lead.services";

type Params = {
  params: Promise<{
    leadId: string;
  }>;
};

export const GET = withHandler(
  async (_req: NextRequest, { params }: Params) => {
    const { leadId } = await params;

    const result = await fetchSellerLead(leadId);

    return result;
  },
);

export const PATCH = withHandler(
  async (req: NextRequest, { params }: Params) => {
    const { leadId } = await params;

    const body = await req.json();

    return updateLead(leadId, body);
  },
);
