// components/ProductTabs/tabs/DescriptionTab.tsx
"use client";

import { memo } from "react";
import { FileText, BookOpen } from "lucide-react";

interface DescriptionTabProps {
  description?: string;
  productName?: string;
}

export const DescriptionTab = memo(function DescriptionTab({
  description,
  productName = "Product",
}: DescriptionTabProps) {
  const hasDescription = description && description.trim().length > 0;

  if (!hasDescription) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No description available</p>
        <p className="text-sm text-gray-400 mt-1">
          This product doesn't have a description yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-50 p-2">
            <BookOpen className="w-5 h-5 text-primary-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              About {productName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Product details and key information
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Description */}
        {hasDescription && <p className="text-slate-700">{description}</p>}
      </div>
    </div>
  );
});
