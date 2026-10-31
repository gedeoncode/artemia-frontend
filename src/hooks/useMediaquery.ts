import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for responsive design using CSS media queries
 *
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  const updateMatches = useCallback(() => {
    if (typeof window !== "undefined") {
      setMatches(window.matchMedia(query).matches);
    }
  }, [query]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Update matches immediately
    updateMatches();

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener (modern approach)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", listener);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(listener);
      }
    };
  }, [query, updateMatches]);

  return matches;
}

/**
 * Predefined media query hooks for common breakpoints
 */
export function useBreakpoints() {
  return {
    isSm: useMediaQuery("(max-width: 639px)"),
    isMd: useMediaQuery("(min-width: 640px) and (max-width: 767px)"),
    isLg: useMediaQuery("(min-width: 768px) and (max-width: 1023px)"),
    isXl: useMediaQuery("(min-width: 1024px) and (max-width: 1279px)"),
    is2Xl: useMediaQuery("(min-width: 1280px)"),

    isMobile: useMediaQuery("(max-width: 1023px)"),
    isMobileOrTablet: useMediaQuery("(max-width: 1023px)"),
    isTabletAndAbove: useMediaQuery("(min-width: 640px)"),
    isDesktopAndAbove: useMediaQuery("(min-width: 1024px)"),

    prefersReducedMotion: useMediaQuery("(prefers-reduced-motion: reduce)"),
    prefersDarkMode: useMediaQuery("(prefers-color-scheme: dark)"),
    prefersLightMode: useMediaQuery("(prefers-color-scheme: light)"),
    prefersHighContrast: useMediaQuery("(prefers-contrast: high)"),
  };
}
