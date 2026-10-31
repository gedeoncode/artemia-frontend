"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBannerRedirect } from '../hooks/';
import { getBannerHref } from '../utils/bannerNavigation';
import { BannerData, Placement } from '@/domain/home/types/banner.types';

interface BannerCardProps {
  banner: BannerData;
  variant: Placement;
  className?: string;
}

export const BannerCard: React.FC<BannerCardProps> = ({
  banner,
  variant,
  className = '',
}) => {
  const [loaded, setLoaded] = useState(false);
  const { handleRedirect } = useBannerRedirect();

  const isHero = variant === 'hero';
  const href = getBannerHref(banner);

  const isExternal = banner.cta?.type === 'external';

const router = useRouter();

useEffect(() => {
  if (href && !isExternal) {
    router.prefetch(href);
  }
}, [href, isExternal, router]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Let Link handle internal navigation
      if (!isExternal) return;

      e.preventDefault();
      handleRedirect(banner);
    },
    [banner, handleRedirect, isExternal]
  );

  const content = (
    <div
      className={`group relative block overflow-hidden rounded-sm ${className}`}
      onClick={handleClick}
    >
      {/* IMAGE */}
      <div className="absolute inset-0">
        {/* Skeleton */}
        <div
          className={`
            absolute inset-0 bg-muted animate-pulse
            ${loaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-500
          `}
        />

        <Image
          src={banner.desktopImage || ""}
          alt={banner.alt || ""}
          fill
          priority={banner.priority || isHero}
          sizes={
            isHero
              ? '(max-width: 1024px) 100vw, 66vw'
              : '(max-width: 1024px) 100vw, 33vw'
          }
          onLoad={() => setLoaded(true)}
          className="object-cover"
        />

        {/* Gradient */}
      </div>
    </div>
  );

  // ✅ Internal navigation → use Link (best for performance)
  if (href && !isExternal) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  // ✅ External or fallback → div with redirect logic
  return content;
};