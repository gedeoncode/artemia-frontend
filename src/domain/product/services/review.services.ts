// lib/api/reviews.ts
import { serverFetch } from "@/lib/http";
import {
  CreateReviewResponse,
  DeleteReviewResponse,
  GetReviewsResponse,
  UpdateReviewResponse,
} from "../types";

/**
 * API Functions
 */

export const fetchReviewByProduct = async (
  productId: string,
): Promise<GetReviewsResponse> => {
  return await serverFetch(`/api/reviews/product/${productId}`, {
    method: "GET",
  });
};

export const createReview = async (data: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<CreateReviewResponse> => {
  return await serverFetch(`/api/reviews`, {
    method: "POST",
    requireAuth: true,
    body: data,
  });
};

export const updateReview = async (
  reviewId: string,
  data: { rating?: number; comment?: string },
): Promise<UpdateReviewResponse> => {
  return await serverFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    requireAuth: true,
    body: data,
  });
};

export const deleteReview = async (
  reviewId: string,
): Promise<DeleteReviewResponse> => {
  return await serverFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    requireAuth: true,
  });
};
