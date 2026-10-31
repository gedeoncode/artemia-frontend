'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="container max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Nav */}
          <div className="w-64 flex-shrink-0 space-y-3">
            <Skeleton className="h-4 w-20" />
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          
          {/* Main Form */}
          <div className="flex-1 max-w-2xl space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Preview */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[150px] w-full rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Footer Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="container max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex justify-end gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}