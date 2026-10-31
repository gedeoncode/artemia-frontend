// components/banner/BannerSkeleton.tsx
import React from 'react';

export const BannerSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Hero skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-[400px] lg:h-[500px]" />
        </div>
        
        {/* Secondary skeletons */}
        <div className="space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-[235px]" />
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-[235px]" />
        </div>
      </div>
    </div>
  );
};