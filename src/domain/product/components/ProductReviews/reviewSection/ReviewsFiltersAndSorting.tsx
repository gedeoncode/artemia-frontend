// ReviewsFiltersAndSorting.tsx
import { RatingFilter, SortOption } from "@/domain/product/types";
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  StarIcon 
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/";

interface ReviewsFiltersAndSortingProps {
  enableSorting?: boolean;
  enableFiltering?: boolean;
  isFiltersVisible: boolean;
  setIsFiltersVisible: (value: boolean) => void;

  ratingFilter: RatingFilter;
  handleRatingFilter: (rating: RatingFilter) => void;

  sortBy: SortOption;
  handleSortChange: (value: SortOption) => void;
}

export function ReviewsFiltersAndSorting({
  enableSorting = true,
  enableFiltering = true,
  isFiltersVisible,
  setIsFiltersVisible,
  ratingFilter,
  handleRatingFilter,
  sortBy,
  handleSortChange,
}: ReviewsFiltersAndSortingProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  if (!enableSorting && !enableFiltering) {
    return null;
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRatingLabel = (filter: RatingFilter) => {
    switch (filter) {
      case "5": return "5 stars";
      case "4": return "4 stars & up";
      case "3": return "3 stars & up";
      case "2": return "2 stars & up";
      case "1": return "1 star";
      default: return "All ratings";
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "recent": return "Most Recent";
      case "highest": return "Highest Rated";
      case "lowest": return "Lowest Rated";
      case "helpful": return "Most Helpful";
      default: return "Sort by";
    }
  };

  const ratingOptions: { value: RatingFilter; label: string; stars: number }[] = [
    { value: "all", label: "All ratings", stars: 0 },
    { value: "5", label: "5 stars", stars: 5 },
    { value: "4", label: "4 stars & up", stars: 4 },
    { value: "3", label: "3 stars & up", stars: 3 },
    { value: "2", label: "2 stars & up", stars: 2 },
    { value: "1", label: "1 star", stars: 1 },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Most Recent" },
    { value: "highest", label: "Highest Rated" },
    { value: "lowest", label: "Lowest Rated" },
    { value: "helpful", label: "Most Helpful" },
  ];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="px-4 sm:px-8 py-3 sm:py-4">
        {/* Mobile: Filter & Sort Toggle Button */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            aria-expanded={isFiltersVisible}
            aria-label="Toggle filters"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters & Sort</span>
            <ChevronDownIcon 
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isFiltersVisible && "rotate-180"
              )} 
            />
          </button>

          {/* Active filters indicator */}
          {(ratingFilter !== "all" || sortBy !== "recent") && (
            <div className="flex items-center gap-1.5">
              {ratingFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg">
                  <StarSolidIcon className="w-3 h-3" />
                  {ratingFilter === "5" ? "5★" : `${ratingFilter}+★`}
                </span>
              )}
              {sortBy !== "recent" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg">
                  {getSortLabel(sortBy)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Desktop & Mobile Expanded Controls */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            "lg:block",
            isFiltersVisible ? "block mt-4 lg:mt-0" : "hidden"
          )}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            {/* Rating Filter - Modern Dropdown */}
            {enableFiltering && (
              <div className="relative" ref={filterRef}>
                {/* Desktop version */}
                <div className="hidden lg:flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Rating:
                  </label>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all min-w-[140px]"
                  >
                    <span className="flex items-center gap-1.5">
                      {ratingFilter !== "all" ? (
                        <>
                          <StarSolidIcon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{getRatingLabel(ratingFilter)}</span>
                        </>
                      ) : (
                        <span>{getRatingLabel(ratingFilter)}</span>
                      )}
                    </span>
                    <ChevronDownIcon className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isFilterOpen && "rotate-180"
                    )} />
                  </button>
                </div>

                {/* Mobile full-width version */}
                <div className="lg:hidden">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Filter by Rating
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleRatingFilter(option.value);
                          if (window.innerWidth < 1024) {
                            // Optional: auto-close on mobile after selection
                          }
                        }}
                        className={cn(
                          "flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all",
                          ratingFilter === option.value
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {option.stars > 0 && (
                          <div className="flex items-center gap-0.5">
                            {[...Array(option.stars)].map((_, i) => (
                              <StarSolidIcon key={i} className="w-3 h-3 text-blue-400" />
                            ))}
                            {option.stars === 4 && (
                              <span className="text-blue-400 text-xs">+</span>
                            )}
                          </div>
                        )}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop dropdown menu */}
                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                      {ratingOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleRatingFilter(option.value);
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2",
                            ratingFilter === option.value
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          {option.stars > 0 && (
                            <div className="flex items-center gap-0.5">
                              {[...Array(Math.min(option.stars, 5))].map((_, i) => (
                                <StarSolidIcon key={i} className="w-3.5 h-3.5 text-blue-400" />
                              ))}
                              {option.stars === 4 && (
                                <span className="text-blue-400 text-xs ml-0.5">+</span>
                              )}
                            </div>
                          )}
                          <span>{option.label}</span>
                          {ratingFilter === option.value && (
                            <CheckIcon className="w-4 h-4 ml-auto text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sort Options - Modern Dropdown */}
            {enableSorting && (
              <div className="relative" ref={sortRef}>
                {/* Desktop version */}
                <div className="hidden lg:flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Sort by:
                  </label>
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all min-w-[140px]"
                  >
                    <span>{getSortLabel(sortBy)}</span>
                    <ChevronDownIcon className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isSortOpen && "rotate-180"
                    )} />
                  </button>
                </div>

                {/* Mobile full-width version */}
                <div className="lg:hidden">
                  <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Sort By
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleSortChange(option.value);
                          if (window.innerWidth < 1024) {
                            // Optional: auto-close on mobile after selection
                          }
                        }}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg border transition-all text-center",
                          sortBy === option.value
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop dropdown menu */}
                {isSortOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleSortChange(option.value);
                            setIsSortOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between",
                            sortBy === option.value
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clear filters button */}
            {(ratingFilter !== "all" || sortBy !== "recent") && (
              <button
                onClick={() => {
                  handleRatingFilter("all");
                  handleSortChange("recent");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors lg:ml-auto"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for checkmark
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}