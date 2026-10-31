"use client";

export function normalizeSellerBoundaryError(error: Error) {
  return {
    title: "Unable to load the product listing page",
    description:
      error.message ||
      "An unexpected issue occurred while loading your listing page.",
    canRetry: true,
  };
}
import { ErrorView } from "@/components/error/ErrorView";

export default function Error({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  //   useEffect(() => {
  //     logError(error);
  //   }, [error]);

  const normalized = normalizeSellerBoundaryError(error);

  return (
    <ErrorView
      title={normalized.title}
      description={normalized.description}
      retry={reset}
    />
  );
}