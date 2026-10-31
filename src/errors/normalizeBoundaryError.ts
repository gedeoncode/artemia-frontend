// shared/errors/normalizeBoundaryError.ts

export function normalizeBoundaryError(
  error: Error & {
    digest?: string;
    statusCode?: number;
    code?: string;
  },
) {
  return {
    title: "Something Went Wrong",
    description:
      error.message ||
      "An unexpected error occurred.",
    canRetry: true,
  };
}