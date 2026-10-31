// useProductReviews.ts
import { useCallback, useMemo, useState } from "react";
import { useReviews } from "./useReviews";
import { RatingFilter, Review, SortOption } from "../../types";



interface UseProductReviewsProps {
  productId: string;
  reviewsPerPage?: number;
}

export function useReviewsSection({
  productId,
  reviewsPerPage = 5,
}: UseProductReviewsProps) {
  const [sortBy, setSortBy] =
    useState<SortOption>("recent");

  const [ratingFilter, setRatingFilter] =
    useState<RatingFilter>("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFiltersVisible, setIsFiltersVisible] =
    useState(false);

const {
  data: reviews = [],
  isLoading,
  error,
  refetch,
  isFetching,
} = useReviews(productId);

  /**
   * Process + filter + sort reviews
   */
  const processedReviews = useMemo(() => {
    if (!reviews?.length) return [];

    let filtered = [...reviews];

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review: Review) =>
          review.rating >= Number(ratingFilter)
      );
    }

    // Sorting
    switch (sortBy) {
      case "recent":
        filtered.sort(
          (a: Review, b: Review) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        break;

      case "highest":
        filtered.sort(
          (a: Review, b: Review) =>
            b.rating - a.rating
        );
        break;

      case "lowest":
        filtered.sort(
          (a: Review, b: Review) =>
            a.rating - b.rating
        );
        break;

      case "helpful":
        filtered.sort(
          (a: Review, b: Review) =>
            (b.helpfulCount || 0) -
            (a.helpfulCount || 0)
        );
        break;
    }

    return filtered;
  }, [reviews, sortBy, ratingFilter]);

  /**
   * Pagination
   */
  const paginatedReviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * reviewsPerPage;

    const endIndex =
      startIndex + reviewsPerPage;

    return processedReviews.slice(
      startIndex,
      endIndex
    );
  }, [
    processedReviews,
    currentPage,
    reviewsPerPage,
  ]);

  /**
   * Statistics
   */
  const statistics = useMemo(() => {
    if (!reviews?.length) return null;

    const averageRating =
      reviews.reduce(
        (sum: number, review: Review) =>
          sum + review.rating,
        0
      ) / reviews.length;

    const ratingDistribution = [1, 2, 3, 4, 5].map(
      (stars) => {
        const count = reviews.filter(
          (r: Review) => r.rating === stars
        ).length;

        return {
          stars,
          count,
          percentage:
            (count / reviews.length) * 100,
        };
      }
    );

    return {
      total: reviews.length,
      averageRating,
      ratingDistribution,
      verifiedCount: reviews.filter(
        (r: Review) => r.verifiedPurchase
      ).length,
    };
  }, [reviews]);

  /**
   * Total pages
   */
  const totalPages = useMemo(() => {
    return Math.ceil(
      processedReviews.length / reviewsPerPage
    );
  }, [processedReviews.length, reviewsPerPage]);

  /**
   * Handlers
   */
  const handleSortChange = useCallback(
    (option: SortOption) => {
      setSortBy(option);
      setCurrentPage(1);
    },
    []
  );

  const handleRatingFilter = useCallback(
    (rating: RatingFilter) => {
      setRatingFilter(rating);
      setCurrentPage(1);
    },
    []
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      document
        .getElementById("reviews-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    },
    []
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
const handleDelete = useCallback(async () => {
  await refetch();

  // Move back a page if current page becomes empty
  const remainingReviews = processedReviews.length - 1;

  const maxPage = Math.max(
    1,
    Math.ceil(remainingReviews / reviewsPerPage)
  );

  if (currentPage > maxPage) {
    setCurrentPage(maxPage);
  }
}, [
  refetch,
  processedReviews.length,
  reviewsPerPage,
  currentPage,
]);

  return {
    // Raw data
    reviews,

    // Processed data
    processedReviews,
    paginatedReviews,
    statistics,

    // UI state
    sortBy,
    ratingFilter,
    currentPage,
    isFiltersVisible,

    // UI setters
    setIsFiltersVisible,

    // Loading state
    isLoading,
    isFetching,
    error,

    // Pagination
    totalPages,

    // Handlers
    handleSortChange,
    handleRatingFilter,
    handlePageChange,
    handleRefresh,
    handleDelete
  };
}