"use client";

import { memo } from "react";

type DashboardErrorStateProps = {
  error: Error;
  onRetry: () => void;
};

export const DashboardErrorState = memo(function DashboardErrorState({
  error,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] px-8 py-12 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="w-16 h-16 mb-6 text-red-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">Failed to load dashboard</h3>
      <p className="mb-4 text-sm text-gray-500 max-w-md">
        {error.message || "An unexpected error occurred while loading your dashboard."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reload page
        </button>
      </div>
    </div>
  );
});