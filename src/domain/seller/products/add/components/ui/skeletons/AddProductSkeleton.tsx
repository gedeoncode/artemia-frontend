"use client";

import React from "react";

export const AddProductSkeleton = () => {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10 animate-pulse">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="h-6 w-48 rounded-md bg-gray-200" />
        <div className="h-4 w-80 rounded-md bg-gray-100" />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className="h-3 w-3 rounded-full bg-gray-300 mb-2" />
            <div className="h-2 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Card Section */}
      <div
    
        className="p-6 bg-white rounded-xl shadow-sm ring-1 ring-gray-100 space-y-6"
      >
        {/* Generic form field placeholders */}
        <div className="space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
          <div className="h-10 w-full bg-gray-100 rounded-md" />
        </div>

        <div className="space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded-md" />
          <div className="h-10 w-full bg-gray-100 rounded-md" />
        </div>

        {/* Image placeholder grid */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-lg" />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
          <div className="h-10 w-24 bg-gray-200 rounded-md" />
          <div className="h-10 w-32 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};
