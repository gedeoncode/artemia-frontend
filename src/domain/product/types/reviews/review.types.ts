// types/review.types.ts
export interface Review {
  _id: string;
  productId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  rating: number; // 1–5
  comment: string;
  createdAt: string;
  updatedAt?: string;
  verifiedPurchase?: boolean;

  // optional enriched fields
  helpfulCount?: number;
}
/**
 * Response Types
 */
export type GetReviewsResponse = {
  data: Review[];
  totalReviews: number;
};

export type CreateReviewResponse = {
  review: Review;
};

export type UpdateReviewResponse = {
  review: Review;
};

export type DeleteReviewResponse = {
  success: boolean;
};
