// app/api/admin/products/[id]/flags/[flag]/route.ts

import { NextRequest } from "next/server";

import { toggleProductFlag } from "@/domain/admin/products/services";

import { withHandler } from "@/lib/http";
import { ProductFlagType } from "@/domain/admin/products/types";

const VALID_FLAGS = ["featured", "deal", "new"] as const;

export const PATCH = withHandler(
  async (
    _req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        id: string;
        flag: ProductFlagType;
      }>;
    },
  ) => {
    const { id, flag } = await params;

    if (!VALID_FLAGS.includes(flag)) {
      throw new Error("Invalid product flag");
    }
    return toggleProductFlag(id, flag);
  },
);
