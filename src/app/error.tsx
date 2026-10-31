"use client";

import { normalizeBoundaryError } from "@/errors/normalizeBoundaryError";
import { ErrorView } from "@/components/error/ErrorView";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  const normalized = normalizeBoundaryError(error);

  return (
    <ErrorView
      title={normalized.title}
      description={normalized.description}
      retry={reset}
    />
  );
}
