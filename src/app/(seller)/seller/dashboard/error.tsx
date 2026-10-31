"use client";
import { ErrorView } from "@/components/error/ErrorView";

export function normalizeError(error: Error) {
  return {
    title: "Failed to load dashboard",
    description:
      error.message ||
      "An unexpected issue occurred while loading your dashboard.",
    canRetry: true,
  };
}
export default function DashboardError({ error, reset }: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
    const normalize = normalizeError(error)
  return <ErrorView title={normalize.title} description={normalize.description} retry={reset} />;
}
