"use client";

import { FiSearch, FiX, FiClock, FiTrendingUp } from "react-icons/fi";
import { useSearch } from "../hooks/useSearch";
import { useEffect } from "react";
import { cx } from "@/lib/utils/classNames";
interface MobileSearchBarProps {
  onFocusChange?: (focused: boolean) => void;
}
export function MobileSearchBar({ onFocusChange }: MobileSearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    recentSearches,
    setRecentSearches,
    executeSearch,
    performSearch,
    clearSearch,
    isLoading,
    isFocused,
    setIsFocused,
    wrapperRef,
    inputRef,
    hasMounted,
  } = useSearch();
  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);
  const showRecent = hasMounted && recentSearches.length > 0;
  const hasSuggestions = suggestions.length > 0;

  return (
    <div className="md:hidden">
      <div className="relative" ref={wrapperRef}>
        {/* Search Input */}
        <div
          className={cx("flex items-center rounded-sm transition-all duration-200 section-soft",
        isFocused && "bg-white shadow-lg ring-2 ring-blue-500" )}
        >
          <button
            onClick={() => setIsFocused(true)}
            className="p-3 text-gray-500"
            aria-label="Search"
          >
            <FiSearch />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="w-full py-2 placeholder-gray-400 bg-transparent outline-none"
          />

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Clear"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Floating Results Panel */}
        {isFocused && (
          <div className="absolute left-0 right-0 z-40 mt-1 overflow-hidden bg-white shadow-2xl rounded-xs top-full animate-fade-in">
            {" "}
            {searchQuery ? (
              <div className="divide-y divide-gray-100">
                {/* Suggestions */}
                <div className="p-3">
                  <h3 className="flex items-center mb-2 text-sm font-medium text-gray-500">
                    <FiTrendingUp className="mr-2" />
                    Suggestions
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  ) : hasSuggestions ? (
                    <ul className="space-y-1">
                      {suggestions.map((s, i) => (
                        <li
                          key={s._id}
                          onClick={() => performSearch(s.name)}
                          className="flex items-center p-2 rounded-md cursor-pointer hover:bg-blue-50"
                        >
                          <FiSearch className="mr-2 text-gray-400" />
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-2 text-sm text-gray-400">
                      No suggestions found
                    </p>
                  )}
                </div>

                {/* Search Action */}
                <div
                  onClick={executeSearch}
                  className="flex items-center p-3 font-medium text-blue-600 cursor-pointer hover:bg-blue-50"
                >
                  <FiSearch className="mr-2" />
                  Search for "{searchQuery}"
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Recent Searches */}
                {showRecent && (
                  <div className="p-3">
                    <h3 className="flex items-center mb-2 text-sm font-medium text-gray-500">
                      <FiClock className="mr-2" />
                      Recent searches
                    </h3>

                    <ul className="space-y-1">
                      {recentSearches.map((term, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setSearchQuery(term);
                            executeSearch();
                          }}
                          className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-blue-50"
                        >
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-gray-400" />
                            {term}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecentSearches((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              );
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <FiX size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



