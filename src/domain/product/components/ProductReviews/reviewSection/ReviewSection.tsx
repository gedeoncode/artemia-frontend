// components/reviews/ReviewsSection.tsx
import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReviewsSection } from "../../../hooks/";
import { ReviewGate } from "../ReviewGate";
import { ReviewCard } from "../ReviewCard";
import {
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { formatNumber } from "../../../utils";
import { ReviewsFiltersAndSorting } from "./ReviewsFiltersAndSorting";
import { EmptyReviewsState } from "../EmptyReviewState";
import { Review } from "@/domain/product/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";

interface Props {
  productId: string;
  productName: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  reviewsPerPage: number;
  onReviewCountChange?: (count: number) => void;
  className?: string;
}

export const ReviewsSection = memo(function ReviewsSection({
  productId,
  productName,
  enableSorting,
  enableFiltering,
  reviewsPerPage,
  className = "",
}: Props) {
  const {
    reviews,

    paginatedReviews,
    statistics,
    sortBy,
    ratingFilter,
    currentPage,
    isFiltersVisible,
    setIsFiltersVisible,
    isLoading,
    isFetching,
    totalPages,
    error,
    processedReviews,
    handleSortChange,
    handleRatingFilter,
    handlePageChange,
    handleRefresh,
    handleDelete,
  } = useReviewsSection({
    productId,
    reviewsPerPage,
  });

  const { user, loading: isAuthLoading } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const hasReviewed = useMemo(() => {
    if (!user?.id) return false;

    return reviews?.some((review) => review.user?._id === user.id);
  }, [user?.id, reviews]);

  const canWriteReview = !hasReviewed;
  // Render loading state
  if (isLoading || isAuthLoading) {
    return (
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-12"
        aria-label="Loading reviews"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-12">
        <div className="text-center space-y-4">
          <p className="text-red-600">Failed to load reviews</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Retry loading reviews"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render no reviews state
  if (!reviews?.length) {
    return (
      <div className="relative">
        <AnimatePresence mode="wait">
          {!isFormOpen ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyReviewsState
                productName={productName}
                onWriteReview={() => setIsFormOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="review-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 py-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Write a Review
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Share your experience with {productName}
                  </p>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="
              text-sm text-gray-500 hover:text-gray-700
              transition-colors self-end sm:self-auto
            "
                >
                  Cancel
                </button>
              </div>

              <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-gray-50/50 to-white">
                <ReviewGate
                  productId={productId}
                  productName={productName}
                  currentUserId={user?.id}
                  currentUserName={user?.name}
                  currentUserEmail={user?.email}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const showingRange = {
    start: (currentPage - 1) * reviewsPerPage + 1,
    end: Math.min(currentPage * reviewsPerPage, processedReviews.length),
  };

  return (
    <section
      id="reviews-section"
      className={`bg-white rounded-sm border border-slate-200 overflow-hidden ${className}`}
      aria-label="Customer Reviews"
    >
      {/* Header - Premium Dashboard Summary */}
      <div className="border-b border-slate-100">
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Column - Rating Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-1.5">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  Reviews
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                    {statistics!.averageRating.toFixed(1)}
                  </span>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                          star <= Math.round(statistics!.averageRating)
                            ? "text-blue-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Based on {formatNumber(statistics!.total)} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => setIsFormOpen((prev) => !prev)}
                aria-expanded={isFormOpen}
                disabled={user?.id ? hasReviewed : false}
                title={
                  user?.id && hasReviewed
                    ? "You have already reviewed this product"
                    : !user?.id
                      ? "Sign in to write a review"
                      : ""
                }
              >
                <PencilSquareIcon className="h-4 w-4" />

                {!canWriteReview
                  ? "Review Submitted"
                  : isFormOpen
                    ? "Close Form"
                    : "Write a Review"}
              </Button>

              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isFetching}
                aria-label="Refresh reviews"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />

                {isFetching ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Review Composer */}
        <AnimatePresence initial={false}>
          {isFormOpen && canWriteReview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="bg-gradient-to-b from-blue-50/[0.35] to-white px-4 sm:px-8 py-4 sm:py-6">
                <ReviewGate
                  productId={productId}
                  productName={productName}
                  currentUserId={user?.id}
                  currentUserName={user?.name}
                  currentUserEmail={user?.email}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Statistics Grid - Rating Distribution & Quick Stats */}
      <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6 border-b border-gray-100 bg-gray-50/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Rating Distribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Rating Distribution
            </h3>
            <div className="space-y-2.5">
              {statistics?.ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2 sm:gap-3 group">
                  <div className="flex items-center gap-1 w-10 sm:w-12">
                    <span className="text-sm text-gray-600">{dist.stars}</span>
                    <StarSolidIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 min-w-[2.5rem] sm:min-w-[3rem] tabular-nums">
                    {formatNumber(dist.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              At a Glance
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-sm border border-gray-100 p-3 sm:p-4 transition-all hover:border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Verified Purchases</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 tabular-nums">
                  {formatNumber(statistics!.verifiedCount)}
                </p>
                <p className="text-xs text-gray-400 mt-1">confirmed buyers</p>
              </div>
              <div className="bg-white rounded-sm border border-slate-100 p-3 sm:p-4 transition-all hover:border-slate-200">
                <p className="text-xs text-slate-500 mb-1">With Photos</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 tabular-nums">
                  {formatNumber(0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">visual reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <ReviewsFiltersAndSorting
          enableSorting={enableSorting}
          enableFiltering={enableFiltering}
          isFiltersVisible={isFiltersVisible}
          setIsFiltersVisible={setIsFiltersVisible}
          ratingFilter={ratingFilter}
          handleRatingFilter={handleRatingFilter}
          sortBy={sortBy}
          handleSortChange={handleSortChange}
        />
      </div>

      {/* Results Header */}
      <div className="px-4 sm:px-8 pt-4 sm:pt-5 pb-2 sm:pb-3">
        <p className="text-xs sm:text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700 tabular-nums">
            {showingRange.start}-{showingRange.end}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700 tabular-nums">
            {formatNumber(processedReviews.length)}
          </span>{" "}
          reviews
          {ratingFilter !== "all" && (
            <span className="inline-flex items-center gap-1 ml-2">
              <span className="text-gray-400">·</span>
              <span className="text-blue-600">{ratingFilter} stars</span>
            </span>
          )}
        </p>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-slate-50">
        {paginatedReviews.map((review: Review, index: number) => (
          <motion.div
            key={review._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="px-4 sm:px-8 py-4 sm:py-6 hover:bg-gray-50/50 transition-colors"
          >
            <ReviewCard
              review={review}
              productId={productId}
              currentUserId={user?.id}
              onReviewUpdated={handleRefresh}
              onReviewDeleted={handleDelete}
            />
          </motion.div>
        ))}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-100 px-4 sm:px-8 py-4 sm:py-5 bg-gray-50/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[2rem] sm:min-w-[2.25rem] h-8 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-white hover:border hover:border-gray-200"
                      }`}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-gray-400">···</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="min-w-[2rem] sm:min-w-[2.25rem] h-8 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-white hover:border hover:border-gray-200 rounded-lg transition-all"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                Next
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-400 tabular-nums">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});