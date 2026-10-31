// hooks/useReducedMotion.ts

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

interface ReducedMotionConfig {
  preferReducedMotion?: boolean;
  disableAnimations?: boolean;
  respectSystemPreference?: boolean;
}

export function useReducedMotion(config: ReducedMotionConfig = {}): boolean {
  const {
    preferReducedMotion = false,
    disableAnimations = false,
    respectSystemPreference = true,
  } = config;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return false;
    }

    // If explicitly disabled, return false
    if (disableAnimations) {
      return true;
    }

    // If explicitly enabled, return true
    if (preferReducedMotion) {
      return true;
    }

    // Check system preference
    if (respectSystemPreference) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
  });

  // Listen for system preference changes
  useEffect(() => {
    if (!respectSystemPreference) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches || disableAnimations || preferReducedMotion);
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy API
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [respectSystemPreference, disableAnimations, preferReducedMotion]);

  // Update when config changes
  useEffect(() => {
    if (disableAnimations) {
      setPrefersReducedMotion(true);
    } else if (preferReducedMotion) {
      setPrefersReducedMotion(true);
    } else if (respectSystemPreference) {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } else {
      setPrefersReducedMotion(false);
    }
  }, [disableAnimations, preferReducedMotion, respectSystemPreference]);

  // Memoized result
  const result = useMemo(() => prefersReducedMotion, [prefersReducedMotion]);

  // Helper hook to conditionally apply animations
  const useConditionalAnimation = useCallback(
    (animationProps: any) => {
      if (prefersReducedMotion) {
        return {
          ...animationProps,
          animationDuration: '0.01ms',
          animationIterationCount: '1',
          transitionDuration: '0.01ms',
        };
      }
      return animationProps;
    },
    [prefersReducedMotion]
  );

  // Helper to get transition duration
  const getTransitionDuration = useCallback(
    (duration: number = 300): string => {
      if (prefersReducedMotion) {
        return '0.01ms';
      }
      return `${duration}ms`;
    },
    [prefersReducedMotion]
  );

  // Helper to get animation duration
  const getAnimationDuration = useCallback(
    (duration: number = 300): string => {
      if (prefersReducedMotion) {
        return '0.01ms';
      }
      return `${duration}ms`;
    },
    [prefersReducedMotion]
  );

  // Helper to check if animation should be enabled
  const shouldAnimate = useCallback((): boolean => {
    return !prefersReducedMotion;
  }, [prefersReducedMotion]);

  // Helper to get accessible animation class
  const getAnimationClass = useCallback(
    (className: string, reducedClassName: string = ''): string => {
      if (prefersReducedMotion) {
        return reducedClassName || className;
      }
      return className;
    },
    [prefersReducedMotion]
  );

  return {
    prefersReducedMotion: result,
    useConditionalAnimation,
    getTransitionDuration,
    getAnimationDuration,
    shouldAnimate,
    getAnimationClass,
  } as any; // Return as a complex object with helpers
}

