// MobileMenuContent.tsx

import { ChevronRight, AlertCircle } from "lucide-react";
import { cx } from "@/lib/utils/classNames";
import { type CategoryNode } from "@/domain/home/services/nodeCategories.services";

type Props = {
  items: CategoryNode[];
  isNavigating: boolean;
  errorState: any;
  selectedCategoryId?: string | null;
  onItemClick: (cat: CategoryNode) => void;
  onRetry: () => void;
  labels: {
    retry: string;
    empty: string;
    error: string;
  };
};

export function MenuContent({
  items,
  isNavigating,
  errorState,
  selectedCategoryId,
  onItemClick,
  onRetry,
  labels,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain">
      {/* Loading */}
 {isNavigating && (
  <div className="p-4 space-y-3 duration-200 animate-in fade-in">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ animationDelay: `${i * 40}ms` }}
      />
    ))}
  </div>
)}

      {/* Error */}
      {errorState && (
        <div role="alert" className="p-4 mx-4 my-4 border border-red-200 rounded-xl bg-red-50">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-red-700">
            <AlertCircle className="w-4 h-4" />
            {labels.error}
          </div>
          <button
            onClick={onRetry}
            className="px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg"
          >
            {labels.retry}
          </button>
        </div>
      )}

      {/* Empty */}
      {!isNavigating && !errorState && items.length === 0 && (
        <div
        aria-live="polite" aria-busy={isNavigating}
         className="px-4 py-8 text-sm text-gray-500">
            
          {labels.empty}
        </div>
      )}

      {/* List */}
      {!isNavigating && !errorState && items.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {items.map((cat,index) => {
            const isSelected = selectedCategoryId === cat._id;

            return (
              <li
  key={cat._id}
  className="duration-300 animate-in fade-in slide-in-from-left-2"
  style={{ animationDelay: `${index * 25}ms` }}
>
                <button
                type="button"
                  onClick={() => onItemClick(cat)}
                  className={cx(
                    "flex w-full items-center justify-between px-4 py-4 text-left",
                    "hover:bg-gray-50 active:bg-gray-100",
                    isSelected && "bg-gray-50"
                  )}
                >
                  <span
                    className={cx(
                      "text-sm font-medium",
                      isSelected ? "text-gray-900" : "text-gray-800"
                    )}
                  >
                    {cat.name}
                  </span>

                  {cat.hasChildren && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}