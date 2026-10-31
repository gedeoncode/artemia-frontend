import { memo } from "react";
import { ProductReviews, ProductReviewsProps } from "./ProductReviews";

// Export a version with AI-powered review summary (placeholder for future)
export const AIProductReviews = memo(function AIProductReviews(props: ProductReviewsProps) {
  return <ProductReviews {...props} showSummary={true} />;
});