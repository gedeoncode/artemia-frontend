// hooks/useSwipeGestures.ts

import { useEffect, useRef, useCallback } from 'react';

interface SwipeConfig {
  enabled: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  elementRef?: React.RefObject<HTMLElement>;
  threshold?: number;
  preventScroll?: boolean;
}

export function useSwipeGestures({
  enabled,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  elementRef,
  threshold = 50,
  preventScroll = false,
}: SwipeConfig) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const isSwiping = useRef(false);
  const direction = useRef<string | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isSwiping.current = false;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;

    // Check if this is a swipe (not a tap)
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      isSwiping.current = true;
    }

    // Determine direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        direction.current = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        direction.current = deltaY > 0 ? 'down' : 'up';
      }
    }

    // Prevent scroll if swiping
    if (preventScroll && isSwiping.current) {
      e.preventDefault();
    }
  }, [enabled, threshold, preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;

    // It's a swipe if:
    // 1. It's not a tap (distance > threshold)
    // 2. It's not too slow (time < 500ms)
    const isSwipe = isSwiping.current && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > threshold;

    if (isSwipe) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      } else {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    // Reset
    touchStart.current = null;
    isSwiping.current = false;
    direction.current = null;
  }, [enabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Attach event listeners
  useEffect(() => {
    if (!enabled) return;

    const element = elementRef?.current || document;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, elementRef, handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]);

  // Return swipe state for external use
  return {
    isSwiping: isSwiping.current,
    direction: direction.current,
  };
}