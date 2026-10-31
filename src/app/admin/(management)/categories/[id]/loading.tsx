'use client';

import LoadingSpinner from "@/components/ui/LoadingSpinner";


export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex mx-auto">
        <LoadingSpinner />
    </div>
  );
}