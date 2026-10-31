"use client";

import React from "react";

import { BannerCard } from "./";
import { useBannerCarousel } from "../hooks";
import { BannerProps } from "@/domain/home/types/banner.types";

export const Banner: React.FC<BannerProps> = ({
  banners,
  sideBanners,
  className = "",
  showIndicators = true,
  showNavigationArrows = true,
  accessibilityLabels = {
    nextSlide: "Next slide",
    previousSlide: "Previous slide",
    slideIndicator: "Go to slide",
    pauseRotation: "Pause auto-rotation",
    resumeRotation: "Resume auto-rotation",
  },
  ...rest
}) => {
  const {
    containerRef,
    currentIndex,
    next,
    prev,
    goTo,
    pause,
    resume,
    hasMultiple,
  } = useBannerCarousel({ banners, ...rest });

  if (!banners.length) return null;

  return (
    <section
      className={`hidden lg:block section-soft py-3 ${className}`}
      aria-label="Promotional banner carousel"
    >
      <div className="layout-container">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-3 min-h-[300px] sm:min-h-[280px] lg:min-h-[400px]">
            <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
              {/* HERO CAROUSEL */}
              <div
                ref={containerRef}
                className="relative h-full lg:col-span-2 group"
                onMouseEnter={pause}
                onMouseLeave={resume}
                onTouchStart={pause}
                onTouchEnd={resume}
              >
                <div className="relative h-full overflow-hidden rounded-lg shadow-lg surface-card-hover">
                  {/* 🎬 CSS SLIDER TRACK */}
                  <div
                    className="flex h-full transition-transform duration-500 ease-out will-change-transform"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    {banners.map((banner) => (
                      <div key={banner.id} className="h-full min-w-full">
                        <BannerCard
                          banner={banner}
                          variant={banner.placement}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>

                  {/* NAVIGATION ARROWS */}
                  {showNavigationArrows && hasMultiple && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute p-2 text-white transition-all duration-200 -translate-y-1/2 rounded-full opacity-0 left-4 top-1/2 bg-black/50 hover:bg-black/70 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={accessibilityLabels.previousSlide}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={next}
                        className="absolute p-2 text-white transition-all duration-200 -translate-y-1/2 rounded-full opacity-0 right-4 top-1/2 bg-black/50 hover:bg-black/70 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={accessibilityLabels.nextSlide}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* INDICATORS */}
                  {showIndicators && hasMultiple && (
                    <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goTo(index)}
                          className={`
                            transition-all duration-200 rounded-full
                            focus:outline-none focus:ring-2 focus:ring-white
                            ${
                              index === currentIndex
                                ? "bg-white w-8 h-2"
                                : "bg-white/50 hover:bg-white/75 w-2 h-2"
                            }
                          `}
                          aria-label={`${accessibilityLabels.slideIndicator} ${index + 1}`}
                          aria-current={index === currentIndex}
                        />
                      ))}
                    </div>
                  )}

                  {/* AUTO-ROTATE CONTROL */}
                </div>
              </div>

              {/* SECONDARY BANNERS */}
              <div className="flex flex-col h-full gap-4">
                {sideBanners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="
                      flex-1 h-full overflow-hidden rounded-lg shadow-md
                      surface-card-hover transform transition-transform duration-200
                      hover:scale-[1.02]
                    "
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BannerCard
                      banner={banner}
                      variant={banner.placement}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
