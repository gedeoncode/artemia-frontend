"use client";

import { memo } from "react";

type DashboardEmptyStateProps = {
  onNavigate: (path: string) => void;
};

export const DashboardEmptyState = memo(function DashboardEmptyState({
  onNavigate,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-8 py-12 text-center">
      <div className="w-16 h-16 mb-6 text-gray-300">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">No data available</h3>
      <p className="mb-6 text-sm text-gray-500">
        We couldn {`&apos`}t find any dashboard data for the selected period.   
      </p>
      <button
        onClick={() => onNavigate("/support")}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Contact support
      </button>
    </div>
  );
});