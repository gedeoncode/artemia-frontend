"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchSuggestions,
  SearchSuggestion,
} from "@/domain/home/services/search";
import { logger } from "@/lib/logger";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  DEBOUNCE_DELAY_MS,
  MIN_QUERY_LENGTH,
  MAX_RECENT_SEARCHES,
} from "@/constants/index";

export function useSearch() {
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "recentSearches",
    [],
  );

  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY_MS);

  useEffect(() => setHasMounted(true), []);
  const loadSuggestions = useCallback(async (query: string) => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await fetchSuggestions(query);
      setSuggestions(data || []);
    } catch (error) {
      logger.error(error, "Failed to fetch search suggestions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }
    loadSuggestions(debouncedQuery);
  }, [debouncedQuery, loadSuggestions]);

  /** Unified search executor: suggestion click OR manual search */
  const performSearch = useCallback(
    (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query) return;

      // Ensure UI input reflects the selected query
      setSearchQuery(query);

      // Update recent searches (dedupe + limit)
      setRecentSearches((prev) =>
        [query, ...prev.filter((s) => s !== query)].slice(
          0,
          MAX_RECENT_SEARCHES,
        ),
      );

      // Navigate
      router.push(`/listing/search?query=${encodeURIComponent(query)}`);

      // UI cleanup
      setIsFocused(false);
      setSuggestions([]);
    },
    [router, setRecentSearches],
  );
  const executeSearch = useCallback(() => {
    performSearch(searchQuery);
  }, [performSearch, searchQuery]);

  /** Clear input */
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    inputRef.current?.focus();
  }, []);

  /** Close on outside click */
  useEffect(() => {
    if (!isFocused) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);

      document.body.style.overflow = "";
    };
  }, [isFocused]);

  return {
    /** state */
    searchQuery,
    setSearchQuery,
    suggestions,
    recentSearches,
    isLoading,
    isFocused,
    hasMounted,

    /** actions */
    executeSearch,
    performSearch,
    clearSearch,
    setIsFocused,
    setRecentSearches,
    setSuggestions,

    /** refs */
    wrapperRef,
    inputRef,
  };
}
