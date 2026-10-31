'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useKeyboardNavigation, useSwipeGesture } from '@/hooks';
import { BannerProps } from '@/domain/home/types/banner.types';

type UseBannerCarouselProps = Pick<
  BannerProps,
  | 'banners'
  | 'autoRotateInterval'
  | 'enableKeyboardNavigation'
  | 'enableTouchGestures'
  | 'pauseOnHover'
  | 'lazyLoad'
>;

export const useBannerCarousel = ({
  banners,
  autoRotateInterval = 5000,
  enableKeyboardNavigation = true,
  enableTouchGestures = true,
  pauseOnHover = true,
}: UseBannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Detect touch
  useEffect(() => {
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);



  const hasMultiple = banners.length > 1;
  const current = banners[currentIndex];

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Transition controller
  const triggerSlide = useCallback(
    (updateFn: (prev: number) => number) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (!isMountedRef.current) return;

          setCurrentIndex(updateFn);

          setTimeout(() => {
            if (isMountedRef.current) {
              setIsTransitioning(false);
            }
          }, 300);
        }, 50);
      });
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    triggerSlide(prev => (prev + 1) % banners.length);
  }, [triggerSlide, banners.length]);

  const prev = useCallback(() => {
    triggerSlide(prev => (prev - 1 + banners.length) % banners.length);
  }, [triggerSlide, banners.length]);

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex || isTransitioning) return;
      triggerSlide(() => index);
    },
    [currentIndex, isTransitioning, triggerSlide]
  );

  // Auto-rotation
  useEffect(() => {
    if (!hasMultiple || isPaused) return;

    const interval = setInterval(() => {
      if (!isTransitioning) next();
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [
    hasMultiple,
    isPaused,
    isTransitioning,
    next,
    autoRotateInterval,
  ]);

  // Interaction handlers
  const pause = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const resume = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  // External hooks
  useKeyboardNavigation(next, prev, enableKeyboardNavigation && hasMultiple);

  useSwipeGesture(
    containerRef,
    enableTouchGestures ? next : undefined,
    enableTouchGestures ? prev : undefined
  );



  const markImageLoaded = useCallback((id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  }, []);

  return {
    // refs
    containerRef,

    // state
    current,
    currentIndex,
    hasMultiple,
    isTransitioning,
    touchDevice,
    loadedImages,

    // actions
    next,
    prev,
    goTo,
    pause,
    resume,

    markImageLoaded,
  };
};