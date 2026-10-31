import { NextRequest } from "next/server";
import { withHandler } from "@/lib/http";
import {
  updateReview,
  deleteReview,
} from "@/domain/product/services/review.services";

export const runtime = "nodejs";

/**
 * GET /api/reviews/:reviewId
 */
// export const GET = withHandler(
//   async (_req: NextRequest, { params }) => {
//     const reviewId = params?.reviewId;

//     if (!reviewId) {
//       throw new Error("reviewId is required");
//     }

//     return await fetchReviewByProduct(reviewId);
//   }
// );

/**
 * PUT /api/reviews/:reviewId
 */
export const PUT = withHandler(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{
        reviewId: string;
      }>;
    },
  ) => {
    const { reviewId } = await params;

    if (!reviewId) {
      throw new Error("ReviewId is required");
    }

    const body = await req.json();

    return await updateReview(reviewId, body);
  },
);

/**
 * DELETE /api/reviews/:reviewId
 */
export const DELETE = withHandler(async (_req: NextRequest, { params }) => {
  const reviewId = params?.reviewId;

  if (!reviewId) {
    throw new Error("ReviewId is required");
  }

  return await deleteReview(reviewId);
});
