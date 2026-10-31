// components/reviews/ProductReviews.tsx

import { ReviewsSection } from "./reviewSection/ReviewSection";
import { cn } from "@/lib/utils/";
import { useState, useCallback, memo, useRef } from "react";
import { toast } from "sonner";


export interface ProductReviewsProps {
  productId: string;
  productName: string;
  averageRating?: number;
  totalReviews?: number;
  className?: string;
  defaultOpen?: boolean;
  showSummary?: boolean;
  enableInfiniteScroll?: boolean;
  reviewsPerPage?: number;
  onReviewSubmitted?: () => void;
}

export const ProductReviews = memo(function ProductReviews({
  productId,
  productName,
  className = "",
  reviewsPerPage = 10,
  onReviewSubmitted,
}: ProductReviewsProps) {

  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  // Handle review submission success
  const handleReviewSubmitted = useCallback(() => {

    // Scroll to reviews section after short delay
    setTimeout(() => {
      reviewsContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);

    // Call parent callback
    onReviewSubmitted?.();

    // Show success toast with confetti effect (optional)
    toast.success("✨ Review published successfully!", {
      duration: 4000,
      icon: "🎉",
    });
  }, [onReviewSubmitted]);

  return (
    <section
      className={cn(
        "overflow-hidden",
        "transition-all duration-300",
        className,
      )}
      aria-labelledby="reviews-heading"
    >
 


        <ReviewsSection
          productId={productId}
          productName={productName}
          enableSorting={true}
          enableFiltering={true}
          reviewsPerPage={reviewsPerPage}
          onReviewCountChange={(count) => {
            // Optional: Update total reviews count
            console.log(`Total reviews: ${count}`);
          }}
        />

    </section>
  );
});
