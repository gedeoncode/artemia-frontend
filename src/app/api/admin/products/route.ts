
import { withHandler } from "@/lib/http";
import { fetchProducts } from "@/domain/admin/products/services";
import { NextRequest } from "next/server";


// GET /api/admin/products
export const GET = withHandler(
  async (req: NextRequest) => {
    const { searchParams } = new URL(
      req.url,
    );

    // =========================================
    // 🔹 Pagination
    // =========================================

    const page =
      searchParams.get("page");

    const limit =
      searchParams.get("limit");

    // =========================================
    // 🔹 Filters
    // =========================================

    const status =
      searchParams.get("status");

    const billingStatus =
      searchParams.get(
        "billingStatus",
      );

    const inventoryStatus =
      searchParams.get(
        "inventoryStatus",
      );

    const category =
      searchParams.get("category");

    const seller =
      searchParams.get("seller");

    // =========================================
    // 🔹 Search & Sorting
    // =========================================

    const search =
      searchParams.get("search");

    const sort =
      searchParams.get("sort");

    // =========================================
    // 🔹 Request
    // =========================================

    return await fetchProducts({
      page: page
        ? Number(page)
        : undefined,

      limit: limit
        ? Number(limit)
        : undefined,

      status:
        status || undefined,

      billingStatus:
        billingStatus ||
        undefined,

      inventoryStatus:
        inventoryStatus ||
        undefined,

      category:
        category || undefined,

      seller:
        seller || undefined,

      search:
        search?.trim() ||
        undefined,

      sort:
        sort || undefined,
    });
  },
);