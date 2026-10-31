import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ReviewGate, ReviewGateProps } from "../ReviewGate";
// Optional: Export a floating action button version
interface FloatingReviewGateProps extends ReviewGateProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}


export const FloatingReviewGate = memo(function FloatingReviewGate({ 
  position = "bottom-right",
  ...props 
}: FloatingReviewGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const reviewUrl = `/product/${props.productId}#reviews`;

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4"
  };

  const handleClick = useCallback(() => {
    if (!user) {
      storePreAuthAction({
        type: "review",
        path: reviewUrl,
        metadata: { productId: props.productId }
      });
      redirectToLogin(router, { redirect: reviewUrl });
    } else {
      setIsOpen(true);
    }
  }, [user, router, reviewUrl, props.productId]);

  if (!user) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "fixed z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg",
          "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "transition-all transform hover:scale-110 active:scale-95",
          positionClasses[position]
        )}
        aria-label="Write a review"
      >
        <PencilSquareIcon className="w-6 h-6" />
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg",
          "hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "transition-all transform hover:scale-110 active:scale-95",
          positionClasses[position]
        )}
        aria-label="Write a review"
      >
        <PencilSquareIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={cn("fixed z-50 w-96", positionClasses[position])}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors z-10"
          aria-label="Close review form"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ReviewGate {...props} className="shadow-2xl" />
      </div>
    </div>
  );
});