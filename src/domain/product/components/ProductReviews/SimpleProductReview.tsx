import { memo } from "react";
import { ReviewGate } from "./ReviewGate";
import { ReviewsSection } from "./reviewSection/ReviewSection";

// Optional: Export a simplified version for specific use cases
export const SimpleProductReviews = memo(function SimpleProductReviews({
  productId,
}: {
  productId: string;
}) {
  return (
    <div className="space-y-6">
      <ReviewGate productId={productId} />
      <ReviewsSection productId={productId} />
    </div>
  );
});
