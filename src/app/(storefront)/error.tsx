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
//   useEffect(() => {
//     logError(error);
//   }, [error]);

  const normalized =
    normalizeBoundaryError(error);

  return (
    <html>
      <body>
        <ErrorView
          title={normalized.title}
          description={normalized.description}
          retry={reset}
        />
      </body>
    </html>
  );
}