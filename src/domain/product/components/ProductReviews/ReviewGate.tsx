// components/reviews/ReviewGate.tsx
import { useRouter } from "next/navigation";
import { redirectToLogin } from "@/lib/utils/redirectToLogin";
import { storePreAuthAction } from "@/lib/utils/navigation/storePreAuthAction";
import {
  UserCircleIcon,
  PencilSquareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/";
import { useCallback, memo } from "react";
import { toast } from "react-toastify";
import { ReviewForm } from "./ReviewForm";
import { Button } from "@/components/ui";

export interface ReviewGateProps {
  productId: string;
  productName?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
  className?: string;
  showIcon?: boolean;
  onReviewSubmitted?: () => void;
  requireVerifiedPurchase?: boolean;
  hasUserPurchased?: boolean;
}

export const ReviewGate = memo(function ReviewGate({
  productId,
  productName,
  currentUserId,
  currentUserName,
  currentUserEmail,
  className = "",
  showIcon = true,
  onReviewSubmitted,
  requireVerifiedPurchase = false,
  hasUserPurchased = false,
}: ReviewGateProps) {
  const router = useRouter();

  const reviewUrl = `/product/${productId}#reviews`;

  const handleLoginRedirect = useCallback(() => {
    // Store the pre-auth action for redirect after login
    storePreAuthAction({
      type: "review",
      path: reviewUrl,
    });

    // Show a toast to inform user about redirect
    toast.info("Please log in to submit your review", {
      position: "top-center",
    });

    redirectToLogin(router, { redirect: reviewUrl });
  }, [reviewUrl, router]);

  const handleReviewSuccess = useCallback(() => {
    toast.success("Your review has been published!");
    onReviewSubmitted?.();

    // Scroll to reviews section to show the new review
    setTimeout(() => {
      const reviewsSection = document.getElementById("reviews-section");
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [onReviewSubmitted]);

  // User is not authenticated - Show login prompt
  if (!currentUserId) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-slate-50 to-white rounded-sm border border-slate-200 p-4 sm:p-6",
          "transition-all hover:shadow-md",
          className,
        )}
        aria-label="Login to review"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            {showIcon && (
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <PencilSquareIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            )}

            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Share Your Experience
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                {productName
                  ? `What do you think about ${productName}?`
                  : "What do you think about this product?"}
              </p>
              <div className="flex items-center gap-0.5 sm:gap-1 mt-1.5 sm:mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                ))}
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2">
                  Share your rating and feedback
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLoginRedirect}
            aria-label="Login to write a review"
            className="w-full md:w-auto"
          >
            Login to Review
          </Button>
        </div>

        {/* Additional incentives for logged-in users */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-500 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1">
              ✓ Help others make informed decisions
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full" />
            <span className="sm:hidden">•</span>
            <span className="inline-flex items-center gap-1">
              ✓ Earn reputation points
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Check verified purchase requirement
  if (requireVerifiedPurchase && !hasUserPurchased) {
    return (
      <div
        className={cn(
          "bg-yellow-50 rounded-sm border border-yellow-200 p-4 sm:p-6",
          className,
        )}
        aria-label="Verified purchase required"
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-yellow-800 mb-0.5 sm:mb-1">
              Verified Purchase Required
            </h4>
            <p className="text-xs sm:text-sm text-yellow-700">
              Only customers who have purchased this product can leave a review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - Show review form
  return (
    <div
      className={cn("bg-white rounded-sm border border-gray-200", className)}
    >
      <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white rounded-t-sm">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {showIcon && <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          Write a Review
          <span className="text-[10px] sm:text-xs font-normal text-gray-500 ml-0 sm:ml-2">
            as {currentUserEmail || currentUserName || "Customer"}
          </span>
        </h3>
      </div>

      <div className="p-4 sm:p-6">
        <ReviewForm
          productId={productId}
          onSuccess={handleReviewSuccess}
          autoFocus={true}
          maxCommentLength={500}
          minCommentLength={10}
        />
      </div>
    </div>
  );
});