import { memo } from "react";
import { ReviewGate, ReviewGateProps } from "./ReviewGate";

// Optional: Export a version with verified purchase check
export const VerifiedPurchaseReviewGate = memo(function VerifiedPurchaseReviewGate(props: ReviewGateProps) {
  return <ReviewGate {...props} requireVerifiedPurchase={true} />;
});