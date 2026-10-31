"use client";

import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { BannerData } from '@/domain/home/types/banner.types';


interface MobileBannerCardProps {
  banner: BannerData;
  onClick?: (banner: BannerData) => void;
  priority?: boolean;
}

/**
 * Optimized Image using next/image
 */
const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="absolute inset-0 ">
      {/* Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      )}

      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 90vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 bg-gray-200">
          Image unavailable
        </div>
      )}
    </div>
  );
});

/**
 * Main Component
 */
export const MobileBannerCard = memo(function MobileBannerCard({
  banner,
  onClick,
  priority = false,
}: MobileBannerCardProps) {
  const [isDragging, setIsDragging] = useState(false);


  const handleClick = useCallback(() => {
    alert("clicked")
    if (!isDragging) {
      onClick?.(banner);
    }
  }, [isDragging, banner, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(banner);
      }
    },
    [banner, onClick]
  );

  const handleTouchStart = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${banner.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="
        relative w-full overflow-hidden rounded-sm
        shadow-sm cursor-pointer
        transition-transform duration-150
        active:scale-[0.97]
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
      style={{
        touchAction: 'pan-y',
        minHeight: 44,
      }}
    >
      {/* Aspect ratio spacer */}
      <div className="h-[400px]" />

      {/* Image Layer */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={banner.mobileImage || ""}
          alt={banner.alt || banner.title}
          priority={priority}
        />
      </div>
    </div>
  );
});