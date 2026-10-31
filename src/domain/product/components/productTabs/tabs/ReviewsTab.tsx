// components/ProductTabs/tabs/ReviewsTab.tsx
"use client";

import { memo, useState } from "react";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { ProductReview } from "@/domain/product/types";

interface ReviewsTabProps {
  productId: string;
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

export const ReviewsTab = memo(function ReviewsTab({
  productId,
  reviews,
  averageRating,
  totalReviews,
}: ReviewsTabProps) {
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "rating">("recent");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "helpful") {
      return b.helpful - a.helpful;
    } else {
      return b.rating - a.rating;
    }
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        <button className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {totalReviews.toLocaleString()} reviews
            </span>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="sort-reviews" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4 divide-y divide-gray-200">
        {sortedReviews.slice(0, 10).map((review) => (
          <article key={review.id} className="pt-4 first:pt-0">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">
                  {review.userName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">
                    {review.userName}
                  </span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-medium text-gray-900 mt-1.5">
                  {review.title}
                </h4>
                <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                  {review.content}
                </p>

                {/* Helpful Button */}
                <button className="flex items-center gap-1.5 mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      {reviews.length > 10 && (
        <button className="w-full py-3 text-center text-primary-600 hover:text-primary-700 font-medium transition-colors border border-gray-200 rounded-lg">
          Load More Reviews
        </button>
      )}
    </div>
  );
});