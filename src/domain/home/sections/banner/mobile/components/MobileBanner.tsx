"use client";
import React, { useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { MobileBannerCard } from "./";

import "swiper/css";
import "swiper/css/free-mode";

import { useBannerRedirect } from "../../hooks";
import { useRouter } from "next/navigation";
import {
  BannerData,
  MobileBannerProps,
} from "@/domain/home/types/banner.types";

export function MobileBanner({
  banners,
  onBannerClick,
  autoplayDelay = 4000,
  className = "",
}: MobileBannerProps) {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { handleRedirect } = useBannerRedirect();

  const handleBannerClick = useCallback(
    (banner: BannerData) => {
      handleRedirect(banner);
      onBannerClick?.(banner); // optional analytics hook
    },
    [handleRedirect, onBannerClick],
  );
  useEffect(() => {
    banners.forEach((banner) => {
      if (banner.cta?.type === "internal" && banner.cta.url) {
        router.prefetch(banner.cta.url);
      }
    });
  }, [banners, router]);

  const resetAutoplay = useCallback(() => {
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    swiperRef.current?.autoplay?.stop();

    interactionTimeoutRef.current = setTimeout(() => {
      swiperRef.current?.autoplay?.start();
    }, 3000);
  }, []);

  const handleTouchStart = useCallback(() => {
    resetAutoplay();
  }, [resetAutoplay]);

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  if (!banners.length) return null;

  return (
    <section
      className={` lg:hidden bg-white py-4 ${className}`}
      aria-label="Mobile banner carousel"
    >
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={12}
        loop={true}
        slidesOffsetBefore={16}
        slidesOffsetAfter={16}
        slidesPerView="auto"
        freeMode={{
          enabled: true,
          momentum: true,
        }}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          stopOnLastSlide: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onTouchStart={handleTouchStart}
        className=" mobile-banner-swiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <MobileBannerCard
              banner={banner}
              onClick={handleBannerClick}
              priority={index === 0 && banner.priority}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
