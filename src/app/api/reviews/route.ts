import { withHandler } from "@/lib/http";
import {
  fetchReviewByProduct,
  createReview,
} from "@/domain/product/services/review.services";

export const GET = withHandler(async (req: Request) => {

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    throw new Error("Product is required");
  }

  return await fetchReviewByProduct(productId);
});

/**
 * POST /api/reviews
 */

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createReview(body);

  return Response.json(result);
}

