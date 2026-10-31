// components/ThumbnailStrip/ThumbnailStrip.tsx

'use client';

import { memo, useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, RotateCw } from 'lucide-react';
import type { GalleryImage } from '../../types/gallery.types';
// import styles from './ThumbnailStrip.module.css';
import { useReducedMotion } from './hooks/useReduceMotion';

interface ThumbnailStripProps {
  images: GalleryImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  visibleCount?: number;
  className?: string;
  productName: string;
}

export const ThumbnailStrip = memo<ThumbnailStripProps>(function ThumbnailStrip({
  images,
  selectedIndex,
  onSelect,
  visibleCount = 5,
  className,
  productName,
}: ThumbnailStripProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // --- Auto-scroll to selected ---
  useEffect(() => {
    const selectedIndexInView = selectedIndex >= scrollIndex && selectedIndex < scrollIndex + visibleCount;
    if (!selectedIndexInView) {
      // Scroll to bring selected into view
      const newScrollIndex = Math.max(0, Math.min(
        selectedIndex - Math.floor(visibleCount / 2),
        images.length - visibleCount
      ));
      setScrollIndex(newScrollIndex);
    }
  }, [selectedIndex, scrollIndex, visibleCount, images.length]);

  // --- Scroll controls ---
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex + visibleCount < images.length;

  const scrollLeft = useCallback(() => {
    setScrollIndex(prev => Math.max(0, prev - visibleCount));
  }, [visibleCount]);

  const scrollRight = useCallback(() => {
    setScrollIndex(prev => Math.min(images.length - visibleCount, prev + visibleCount));
  }, [images.length, visibleCount]);

  // --- Touch gestures for thumbnail strip ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = touchStartX - e.touches[0].clientX;
    if (Math.abs(deltaX) > 50) {
      setIsDragging(false);
      if (deltaX > 0 && canScrollRight) {
        scrollRight();
      } else if (deltaX < 0 && canScrollLeft) {
        scrollLeft();
      }
    }
  }, [touchStartX, isDragging, canScrollLeft, canScrollRight, scrollLeft, scrollRight]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && e.target === containerRef.current) {
        e.preventDefault();
        if (selectedIndex > 0) onSelect(selectedIndex - 1);
      } else if (e.key === 'ArrowRight' && e.target === containerRef.current) {
        e.preventDefault();
        if (selectedIndex < images.length - 1) onSelect(selectedIndex + 1);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length, onSelect]);

  // --- Visible images ---
  const visibleImages = images.slice(scrollIndex, scrollIndex + visibleCount);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.thumbnailStrip, className)}
      role="tablist"
      aria-label="Product image thumbnails"
      tabIndex={0}
    >
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          className={clsx(styles.scrollButton, styles.scrollLeft)}
          onClick={scrollLeft}
          aria-label="Scroll thumbnails left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Thumbnails Container */}
      <div
        ref={stripRef}
        className={styles.thumbnails}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(-${scrollIndex * (100 / visibleCount)}%)`,
          transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {visibleImages.map((image, index) => {
          const globalIndex = scrollIndex + index;
          const isSelected = globalIndex === selectedIndex;

          return (
            <button
              key={image.id}
              className={clsx(styles.thumbnail, {
                [styles.selected]: isSelected,
                [styles.video]: image.isVideo,
                [styles.is360]: image.is360,
              })}
              onClick={() => onSelect(globalIndex)}
              role="tab"
              aria-selected={isSelected}
              aria-label={`View image ${globalIndex + 1}: ${image.alt}`}
              tabIndex={isSelected ? 0 : -1}
            >
              <Image
                src={image.thumbnailUrl || image.url}
                alt={`${productName} thumbnail ${globalIndex + 1}`}
                fill
                sizes="(max-width: 640px) 20vw, (max-width: 1024px) 10vw, 8vw"
                className={styles.thumbnailImage}
                loading={globalIndex < preloadCount ? 'eager' : 'lazy'}
              />

              {/* Video indicator */}
              {image.isVideo && (
                <div className={styles.mediaIndicator}>
                  <Play size={16} />
                </div>
              )}

              {/* 360° indicator */}
              {image.is360 && (
                <div className={styles.mediaIndicator}>
                  <RotateCw size={16} />
                </div>
              )}

              {/* Selection ring */}
              {isSelected && (
                <div className={styles.selectionRing} />
              )}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          className={clsx(styles.scrollButton, styles.scrollRight)}
          onClick={scrollRight}
          aria-label="Scroll thumbnails right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
});