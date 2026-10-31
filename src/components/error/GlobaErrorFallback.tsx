"use client";

import { AlertTriangle } from "lucide-react";
export interface GlobalErrorFallbackProps { 
        error: Error; onRetry: () => void 
    }

export function GlobalErrorFallback({ error, onRetry }: GlobalErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-red-800 bg-red-50">
      <AlertTriangle className="w-12 h-12 mb-4" />
      <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md mb-6 text-sm text-center">
        An unexpected application error occurred. This may be temporary.
      </p>

      {process.env.NODE_ENV === "development" && (
        <pre className="max-w-lg p-4 mb-4 overflow-auto text-xs text-red-700 bg-white border border-red-200 rounded-lg shadow-sm">
          {error?.stack || String(error)}
        </pre>
      )}

      <button
        onClick={onRetry}
        className="px-4 py-2 font-medium text-white transition bg-red-600 rounded-lg shadow hover:bg-red-700"
      >
        Reload Application
      </button>
    </div>
  );
}
