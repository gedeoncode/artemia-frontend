"use client";

import { BsSearch, BsX, BsClockHistory } from "react-icons/bs";
import { useSearch } from "../hooks/useSearch";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { cx } from "@/lib/utils/classNames";
interface DeskSearchBarProps {
  onFocusChange?: (focused: boolean) => void;
}

export function DeskSearchBar({ onFocusChange }: DeskSearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    setSuggestions,
    recentSearches,
    setRecentSearches,
    executeSearch,
    performSearch,
    clearSearch,
    isLoading,
    isFocused,
    setIsFocused,

    hasMounted,
    wrapperRef,
    inputRef,
  } = useSearch();
  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);

  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => setHighlightIndex(-1), [suggestions]);

  const showRecentSearches = hasMounted && recentSearches.length > 0;
  const hasSuggestions = suggestions.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "ArrowDown") {
      e.preventDefault();
      if (!hasSuggestions) return;
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (key === "ArrowUp") {
      e.preventDefault();
      if (!hasSuggestions) return;
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (key === "Enter") {
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        performSearch(suggestions[highlightIndex].name);
      }
      executeSearch();
    }

    if (key === "Escape") {
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative z-50 flex-1 hidden max-w-xl mx-4 md:block"
      >
        {/* Input */}
        <div
          tabIndex={0}
          className={cx(
            "relative flex items-center w-full section-soft rounded-sm",
            isFocused &&
              "focus:bg-white/90 outline-none ring-2 ring-blue-500 shadow-lg bg-white/90"
          )}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isFocused}
            aria-autocomplete="list"
            aria-controls="search-suggestion-list"
            aria-activedescendant={
              highlightIndex >= 0 && suggestions[highlightIndex]
                ? `suggestion-${suggestions[highlightIndex]._id}`
                : undefined
            }
           className="w-full px-4 text-gray-800 placeholder-gray-500 transition-all duration-200 bg-transparent outline-none focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute text-gray-500 transition-colors right-14 hover:text-gray-700"
            >
              <BsX className="text-2xl" />
            </button>
          )}
          <button
            onClick={executeSearch}
            disabled={isLoading}
            className="px-3 py-2.5 text-white transition-all bg-secondary-button rounded-r-sm "
          >
            <BsSearch className="text-xl" />
          </button>
        </div>

        {/* Suggestions */}
        {isFocused && (
          <div
            className="absolute left-0 right-0 z-50 w-full mt-1 overflow-hidden bg-white rounded-sm shadow-2xl top-full animate-fade-in"
            role="listbox"
            id="search-suggestion-list"
          >
            {searchQuery ? (
              isLoading ? (
                <div className="px-4 py-3 text-gray-500 animate-pulse">
                  <div className="flex justify-center p-4">
                    <LoadingSpinner size="md" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Empty state */}
                  {!hasSuggestions && (
                    <div className="px-4 py-3 text-gray-500">
                      No suggestions found.
                    </div>
                  )}

                  {hasSuggestions && (
                    <ul className="py-1 border-b border-gray-100">
                      <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                        Suggestions for "{searchQuery}"
                      </h3>

                      {suggestions.map((s, i) => (
                        <li
                          key={s._id}
                          id={`suggestion-${s._id}`}
                          role="option"
                          aria-selected={highlightIndex === i}
                          onMouseEnter={() => setHighlightIndex(i)}
                          onClick={() => performSearch(s.name)}
                          className={`px-4 py-2 cursor-pointer transition-colors ${
                            highlightIndex === i
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div
                    className="px-4 py-2 font-medium transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={executeSearch}
                  >
                    Search for "{searchQuery}"
                  </div>
                </>
              )
            ) : (
              showRecentSearches && (
                <div>
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                    Recent searches
                  </h3>
                  <ul className="py-1">
                    {recentSearches.map((term, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-4 py-2 transition-colors cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSearchQuery(term);
                          inputRef.current?.focus();
                        }}
                      >
                        <div className="flex items-center">
                          <BsClockHistory className="mr-3 text-gray-400" />
                          <span className="truncate">{term}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
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
        )}
      </div>

      {/* Overlay */}
      {/* {isFocused && (
        <div
          className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setIsFocused(false);
            setSuggestions([]);
          }}
        />
      )} */}
    </>
  );
}
