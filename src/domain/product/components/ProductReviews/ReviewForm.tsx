// components/reviews/ReviewForm.tsx
import { useCreateReview } from "../../hooks";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils/";
import { Button } from "@/components/ui";

export interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  autoFocus?: boolean;
  initialRating?: number;
  showCancelButton?: boolean;
  maxCommentLength?: number;
  minCommentLength?: number;
}

export const ReviewForm = memo(function ReviewForm({
  productId,
  onSuccess,
  onCancel,
  className = "",
  autoFocus = false,
  initialRating = 5,
  showCancelButton = false,
  maxCommentLength = 1000,
  minCommentLength = 10,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState({
    rating: false,
    comment: false,
  });
  const [isFocused, setIsFocused] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate, isPending, error } = useCreateReview(productId);

  // Validation
  const errors = useCallback(
    () => ({
      rating:
        touched.rating && (rating < 1 || rating > 5)
          ? "Please select a rating between 1 and 5 stars"
          : null,

      comment:
        touched.comment && !comment.trim()
          ? "Please enter your review comment"
          : touched.comment && comment.trim().length < minCommentLength
            ? `Review must be at least ${minCommentLength} characters`
            : touched.comment && comment.trim().length > maxCommentLength
              ? `Review cannot exceed ${maxCommentLength} characters`
              : null,
    }),
    [
      touched.rating,
      touched.comment,
      rating,
      comment,
      minCommentLength,
      maxCommentLength,
    ],
  );

  const isValid =
    rating >= 1 &&
    rating <= 5 &&
    comment.trim().length >= minCommentLength &&
    comment.trim().length <= maxCommentLength;

  const characterCount = comment.length;
  const isNearLimit = characterCount > maxCommentLength * 0.9;
  const isAtLimit = characterCount >= maxCommentLength;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setTouched({ rating: true, comment: true });

      if (!isValid) {
        const firstError = errors.rating || errors.comment;
        if (firstError) {
          toast.error(firstError, {
            position: "bottom-right",
          });
          if (errors.comment) {
            commentRef.current?.focus();
          }
        }
        return;
      }

      const trimmedComment = comment.trim();

      mutate(
        { productId, rating, comment: trimmedComment },
        {
          onSuccess: () => {
            toast.success("Thank you for your review!", {
              position: "bottom-right",
              icon: <CheckCircleIcon className="w-4 h-4" />,
            });

            setComment("");
            setRating(initialRating);
            setTouched({ rating: false, comment: false });
            onSuccess?.();

            const announcement = document.createElement("div");
            announcement.setAttribute("aria-live", "polite");
            announcement.className = "sr-only";
            announcement.textContent = "Review submitted successfully";
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 3000);
          },
          onError: (error) => {
            toast.error(
              error.message || "Failed to submit review. Please try again.",
              {
                position: "bottom-right",
              },
            );
          },
        },
      );
    },
    [
      comment,
      rating,
      isValid,
      errors,
      mutate,
      productId,
      initialRating,
      onSuccess,
    ],
  );

  const handleRatingClick = useCallback((selectedRating: number) => {
    setRating(selectedRating);
    setTouched((prev) => ({ ...prev, rating: true }));
  }, []);

  const handleRatingKeyDown = useCallback(
    (e: React.KeyboardEvent, selectedRating: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRatingClick(selectedRating);
      }
    },
    [handleRatingClick],
  );

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= maxCommentLength) {
        setComment(value);
      }
    },
    [maxCommentLength],
  );

  const handleCommentBlur = useCallback(() => {
    setTouched((prev) => ({ ...prev, comment: true }));
    setIsFocused(false);
  }, []);

  const handleCommentFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleCancel = useCallback(() => {
    setComment("");
    setRating(initialRating);
    setTouched({ rating: false, comment: false });
    onCancel?.();
  }, [initialRating, onCancel]);

  // Auto-focus effect
  useEffect(() => {
    if (autoFocus && commentRef.current) {
      commentRef.current.focus();
    }
  }, [autoFocus]);

  // Hash-based focus
  useEffect(() => {
    if (window.location.hash === "#reviews" && commentRef.current) {
      commentRef.current.focus();
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = commentRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [comment]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn("space-y-4 sm:space-y-6", className)}
      aria-label="Write a review form"
      noValidate
    >
      {/* Rating Selection - Modern & Interactive */}
      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Overall Rating
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          {touched.rating && rating > 0 && (
            <span className="text-[11px] sm:text-xs text-green-600 flex items-center gap-0.5 sm:gap-1">
              <CheckCircleIcon className="w-3 h-3 sm:w-3 sm:h-3" />
              Selected
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 sm:gap-1.5 flex-wrap"
          role="group"
          aria-label="Rating selection"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onKeyDown={(e) => handleRatingKeyDown(e, star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              className="group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-0.5 transition-all hover:scale-110"
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              aria-pressed={rating >= star}
            >
              {(
                hoveredRating !== null ? star <= hoveredRating : star <= rating
              ) ? (
                <StarSolidIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400 transition-all drop-shadow-sm" />
              ) : (
                <StarOutlineIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300 transition-all group-hover:text-gray-400" />
              )}
            </button>
          ))}
        </div>

        {errors.rating && (
          <p
            className="text-xs sm:text-sm text-red-600 flex items-center gap-1 sm:gap-1.5"
            role="alert"
          >
            <span className="text-red-500">•</span>
            {errors.rating}
          </p>
        )}
      </div>

      {/* Review Input - Premium Text Area */}
      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="review-comment"
            className="text-xs sm:text-sm font-medium text-gray-700"
          >
            Your Review
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <span className="text-[11px] sm:text-xs text-gray-400 tabular-nums">
            Min. {minCommentLength} chars
          </span>
        </div>

        <div
          className={cn(
            "relative rounded-lg border transition-all duration-200",
            isFocused
              ? "border-blue-400 ring-2 ring-blue-500/20"
              : errors.comment && touched.comment
                ? "border-red-300"
                : "border-gray-200 hover:border-gray-300",
          )}
        >
          <textarea
            id="review-comment"
            ref={commentRef}
            className={cn(
              "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed",
              "text-sm sm:text-base text-gray-700 placeholder:text-gray-400 resize-y",
              "transition-colors",
            )}
            placeholder="What do you think about this product? Share your honest experience..."
            value={comment}
            onChange={handleCommentChange}
            onBlur={handleCommentBlur}
            onFocus={handleCommentFocus}
            rows={4}
            maxLength={maxCommentLength}
            disabled={isPending}
            aria-required="true"
          />

          {/* Character Counter - Modern Progress Indicator */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={cn(
                  "text-[10px] sm:text-xs transition-colors tabular-nums",
                  isAtLimit
                    ? "text-red-500"
                    : isNearLimit
                      ? "text-blue-500"
                      : "text-gray-400",
                )}
              >
                {characterCount}/{maxCommentLength}
              </div>
              {characterCount > 0 && characterCount < maxCommentLength && (
                <div className="hidden sm:block w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      isNearLimit ? "bg-blue-400" : "bg-blue-400",
                    )}
                    style={{
                      width: `${(characterCount / maxCommentLength) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {errors.comment && touched.comment && (
          <p
            id="comment-error"
            className="text-xs sm:text-sm text-red-600 flex items-center gap-1 sm:gap-1.5"
            role="alert"
          >
            <span className="text-red-500">•</span>
            {errors.comment}
          </p>
        )}
      </div>

      {/* API Error - Subtle Alert */}
      {error && (
        <div
          className="rounded-lg bg-red-50/50 border border-red-100 px-3 sm:px-4 py-2.5 sm:py-3"
          role="alert"
        >
          <p className="text-xs sm:text-sm text-red-700 flex items-center gap-1.5 sm:gap-2">
            <span className="text-red-500">⚠️</span>
            {error.message || "Failed to submit review. Please try again."}
          </p>
        </div>
      )}

      {/* Form Actions - Balanced CTAs */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
        <Button
          type="submit"

          isPending={isPending }
          disabled={isPending || !isValid}
          className="flex-1 sm:flex-none w-full sm:w-auto"
          aria-label="Submit review"
        >
          Publish Review
        </Button>

        {showCancelButton && (
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 sm:flex-none w-full sm:w-auto"
            aria-label="Cancel"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Additional Info - Subtle Guidance */}
      <div className="pt-1.5 sm:pt-2 border-t border-gray-100">
        <div className="flex items-start gap-1.5 sm:gap-2">
          <ChatBubbleLeftRightIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed">
            Your review helps other customers make informed decisions. Please be
            honest and respectful in your feedback.
          </p>
        </div>
      </div>
    </form>
  );
});