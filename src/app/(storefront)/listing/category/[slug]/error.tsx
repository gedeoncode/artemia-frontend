"use client";
import { ErrorView } from "@/components/error/ErrorView";

export function normalizeError(error: Error) {
  return {
    title: "Failed to load Category page",
    description:
      error.message ||
      "An unexpected issue occurred while loading Category page.",
    canRetry: true,
  };
}
export default function CategoryError({ error, reset }: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
    const normalize = normalizeError(error)
  return <ErrorView title={normalize.title} description={normalize.description} retry={reset} />;
}