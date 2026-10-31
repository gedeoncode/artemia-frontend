"use client";

import { BsClockHistory, BsX } from "react-icons/bs";
import type { SearchSuggestion } from "@/domain/home/services/search";

interface SearchSuggestionsProps {
  searchQuery: string;
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  isLoading: boolean;
  isFocused: boolean;

  showRecentSearches: boolean;

  onSelectSuggestion: (value: string) => void;
  onRemoveRecent: (index: number) => void;
  onSearch: () => void;
}

export function SearchSuggestions({
  searchQuery,
  suggestions,
  recentSearches,
  isLoading,
  isFocused,
  showRecentSearches,
  onSelectSuggestion,
  onRemoveRecent,
  onSearch,
}: SearchSuggestionsProps) {
  if (!isFocused) return null;

  return (
    <div className="absolute left-0 right-0 z-50 w-full mt-1 overflow-hidden bg-white rounded-lg shadow-lg top-full animate-fade-in">
      {/* When user typed something */}
      {searchQuery ? (
        isLoading ? (
          <div className="px-4 py-3 text-gray-500 animate-pulse">
            Loading suggestions...
          </div>
        ) : (
          <>
            {suggestions.length > 0 && (
              <div className="border-b border-gray-100">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                  Suggestions for "{searchQuery}"
                </h3>

                <ul className="py-1">
                  {suggestions.map((s) => (
                    <li
                      key={s._id}
                      onClick={() => onSelectSuggestion(s.name)}
                      className="px-4 py-2 transition-colors cursor-pointer hover:bg-gray-50"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div
              className="px-4 py-2 font-medium transition-colors cursor-pointer hover:bg-gray-50"
              onClick={onSearch}
            >
              Search for "{searchQuery}"
            </div>
          </>
        )
      ) : (
        /* Empty input ─ recent searches */
        showRecentSearches && (
          <div>
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
              Recent searches
            </h3>

            <ul className="py-1">
              {recentSearches.map((term, index) => (
                <li
                  key={index}
                  onClick={() => onSelectSuggestion(term)}
                  className="flex items-center justify-between px-4 py-2 transition-colors cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <BsClockHistory className="mr-3 text-gray-400" />
                    <span className="truncate">{term}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecent(index);
                    }}
                    className="p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-200"
                  >
                    <BsX />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
