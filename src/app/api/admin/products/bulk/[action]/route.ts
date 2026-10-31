// app/api/admin/products/bulk/[action]/route.ts

import { NextRequest } from "next/server";

import { withHandler } from "@/lib/http";
import { bulkProductAction } from "@/domain/admin/products/services";
import { BulkActionType } from "@/domain/admin/products/types";

type RouteContext = {
  params: Promise<{
    action: BulkActionType;
  }>;
};

export const PATCH = withHandler(
  async (req: NextRequest, context: RouteContext) => {
    const body = await req.json();

    const { action } = await context.params;

    if (!action) {
      throw new Error("Invalid bulk action");
    }

    const payload = {
      ids: body.ids,
    };

    if (action === "reject") {
      Object.assign(payload, {
        reject: {
          rejectionReason: body.rejectionReason,
          rejectionCode: body.rejectionCode,
        },
      });
    }

    return bulkProductAction(action, payload);
  },
);
