// components/reviews/ReviewCard.tsx
import { useState, useCallback, memo } from "react";
import { useUpdateReview, useDeleteReview } from "../../hooks/";
import { Review } from "../../types";
import { Rating } from "../ui";
import { toast } from "react-toastify";
import { 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon, 
  CheckIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib";

type Props = {
  review: Review;
  currentUserId?: string;
  productId: string;
  onReviewUpdated?: () => void;
  onReviewDeleted?: () => void;
  isReadOnly?: boolean;
};

export const ReviewCard = memo(function ReviewCard({ 
  review, 
  currentUserId, 
  productId,
  onReviewUpdated,
  onReviewDeleted,
  isReadOnly = false
}: Props) {
  const isOwner = !!currentUserId && review?.user?._id === currentUserId;
  const canModify = isOwner && !isReadOnly;

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(productId);
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(productId);

  const handleUpdate = useCallback(() => {
    const trimmedComment = comment.trim();
    
    if (!trimmedComment) {
      toast.error("Review comment cannot be empty", {
        position: "bottom-right"
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5 stars", {
        position: "bottom-right"
      });
      return;
    }

    updateReview(
      {
        reviewId: review._id,
        data: { rating, comment: trimmedComment },
      },
      {
        onSuccess: () => {
          toast.success("Review updated successfully", {
            position: "bottom-right"
          });
          setIsEditing(false);
          onReviewUpdated?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update review", {
            position: "bottom-right"
          });
        },
      }
    );
  }, [comment, rating, review._id, updateReview, onReviewUpdated]);

  const handleDelete = useCallback(() => {
    deleteReview(review._id, {
      onSuccess: () => {
        toast.success("Review deleted successfully", {
          position: "bottom-right"
        });
        onReviewDeleted?.();
        setIsDeleteConfirmOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete review", {
          position: "bottom-right"
        });
      },
    });
  }, [review._id, deleteReview, onReviewDeleted]);

  const handleCancelEdit = useCallback(() => {
    setRating(review.rating);
    setComment(review.comment);
    setIsEditing(false);
  }, [review.rating, review.comment]);

  const getRelativeTime = useCallback((date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }, []);

  const handleRatingKeyDown = useCallback((e: React.KeyboardEvent, value: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRating(value);
    }
  }, []);

  return (
    <>
      <article 
        className="relative bg-white rounded-sm border border-slate-100 transition-all duration-200 hover:border-slate-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Review by ${review.user?.name || "Anonymous"}`}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {/* HEADER SECTION - Refined Layout */}
          <header className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Avatar - Modern Gradient Fallback */}
              <div className="flex-shrink-0">
                {review.user?.avatar ? (
                  <img
                    src={review.user?.avatar}
                    alt={`${review.user?.name || "User"}'s avatar`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-50"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                )}
              </div>

              {/* User Info - Clean Hierarchy */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm tracking-tight">
                    {review.user?.name || "Anonymous User"}
                  </p>
                  {review.verifiedPurchase && (
                    <span 
                      className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-green-50 text-green-700"
                      title="Verified purchase"
                    >
                      <CheckIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  <time 
                    dateTime={new Date(review.createdAt).toISOString()}
                    className="text-[11px] sm:text-xs text-gray-400"
                  >
                    {getRelativeTime(review.createdAt)}
                  </time>
                  
                  {review.updatedAt && review.updatedAt !== review.createdAt && (
                    <>
                      <span className="text-[11px] sm:text-xs text-gray-300">·</span>
                      <span 
                        className="text-[11px] sm:text-xs text-gray-400"
                        title={`Edited ${new Date(review.updatedAt).toLocaleString()}`}
                      >
                        Edited
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Refined Visibility */}
            {canModify && !isEditing && (
              <div className={cn(
                "flex items-center gap-1 transition-all duration-200",
                "sm:opacity-0 sm:group-hover:opacity-100",
                isHovered && "sm:opacity-100"
              )}>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                  aria-label="Edit review"
                  title="Edit review"
                >
                  <PencilIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                  aria-label="Delete review"
                  title="Delete review"
                >
                  <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </header>

          {/* CONTENT SECTION - Streamlined */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-3 sm:mt-4 space-y-3 sm:space-y-4"
              >
                {/* Rating Input - Modern Slider */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-1 max-w-[200px] sm:max-w-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onKeyDown={(e) => handleRatingKeyDown(e, star)}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-0.5 transition-all hover:scale-110"
                          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                          <StarSolidIcon
                            className={cn(
                              "w-5 h-5 sm:w-6 sm:h-6 transition-all",
                              star <= rating ? "text-blue-400" : "text-gray-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[2.5rem] sm:min-w-[3rem] tabular-nums">
                      {rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment Input - Clean Textarea */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[80px] sm:min-h-[100px] transition-all"
                    placeholder="Update your review here..."
                    aria-label="Edit your review comment"
                    disabled={isUpdating}
                  />
                </div>

                {/* Action Buttons - Balanced */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 pt-1 sm:pt-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Save changes"
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Cancel editing"
                  >
                    <XMarkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 sm:mt-4 space-y-2 sm:space-y-3"
              >
                {/* Rating Display - Interactive Stars */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Rating rating={review.rating} />
                  <span className="text-[11px] sm:text-xs text-gray-400 tabular-nums">
                    ({review.rating}.0)
                  </span>
                </div>
                
                {/* Comment - Clean Typography */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                  {review.comment}
                </p>

                {/* Helpful Actions - Optional Enhancement */}
                <div className="flex items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                  <button 
                    className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-0.5 sm:gap-1"
                    aria-label="Mark as helpful"
                  >
                    <ChatBubbleLeftRightIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Helpful
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </article>

      {/* DELETE CONFIRMATION MODAL - Premium Redesign */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDeleteConfirmOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm deletion"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden mx-3 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg sm:rounded-xl">
                    <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1">
                      Delete Review
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Are you sure you want to delete this review? This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4 sm:mt-6">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isDeleting ? "Deleting..." : "Delete Review"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ReviewCard.displayName = "ReviewCard";