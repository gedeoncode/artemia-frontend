import { clientFetch } from "@/lib/http/";
import { CreateReviewResponse, DeleteReviewResponse, GetReviewsResponse, UpdateReviewResponse, } from "@/domain/product/types";

/**
 * API Calls (Next.js routes)
 */
export const getReviews = async (
  productId: string
): Promise<GetReviewsResponse> => {
  return clientFetch(`/api/reviews?productId=${productId}`);
};

export const createReviewApi = async (data: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<CreateReviewResponse> => {

  const res = await clientFetch(`/api/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res
};

export const updateReviewApi = async (
  reviewId: string,
  data: { rating?: number; comment?: string }
): Promise<UpdateReviewResponse> => {
  return clientFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteReviewApi = async (
  reviewId: string
): Promise<DeleteReviewResponse> => {

  return clientFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
};