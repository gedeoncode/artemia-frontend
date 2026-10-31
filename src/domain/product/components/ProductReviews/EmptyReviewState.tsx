import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "lucide-react";
import { memo } from "react";

// Empty State Component
export const EmptyReviewsState = memo(function EmptyReviewsState({ 
  productName, 
  onWriteReview 
}: { 
  productName?: string; 
  onWriteReview: () => void;
}) {
  return (
    <div className="text-center py-4  px-6">
      <div className="inline-flex items-center justify-center w-20 h-20   mb-4">
        <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Reviews Yet
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-4">
        {productName 
          ? `Be the first to share your experience with ${productName}`
          : "Be the first to share your thoughts about this product"}
      </p>
      <button
        onClick={onWriteReview}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-sm hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
      >
        <SparklesIcon className="w-4 h-4" />
        Write a Review
      </button>
    </div>
  );
});