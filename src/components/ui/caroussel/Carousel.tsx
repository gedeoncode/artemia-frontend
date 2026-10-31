"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import CarouselControls from "./CarouselControls";
import { BaseProduct as Product } from "@/types/product/product.types";

type Breakpoints = {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const Carousel = ({
  items,
  showCarousel,
  breakpoints,
  children,
}: {
  items: Product[];
  showCarousel: boolean;
  breakpoints: Breakpoints;
  children: (item: any) => React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial SSR-safe visible count
  const [visibleCount, setVisibleCount] = useState(breakpoints.base);

  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  // Compute visibleCount client-side only

  const updateVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;

    if (breakpoints.xl && width >= 1280) {
      setVisibleCount(breakpoints.xl);
    } else if (breakpoints.lg && width >= 1024) {
      setVisibleCount(breakpoints.lg);
    } else if (breakpoints.md && width >= 768) {
      setVisibleCount(breakpoints.md);
    } else if (breakpoints.sm && width >= 640) {
      setVisibleCount(breakpoints.sm);
    } else {
      setVisibleCount(breakpoints.base);
    }
  }, [breakpoints]);

  const updateDisabledStates = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setDisablePrev(scrollLeft <= 0);
    setDisableNext(scrollLeft + clientWidth >= scrollWidth - 5);
  }, []);

  const scrollByItem = (direction: "next" | "prev") => {
    const container = containerRef.current;
    if (!container) return;

    const childWidth = container.firstElementChild?.clientWidth || 0;
    const scrollAmount = direction === "next" ? childWidth : -childWidth;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Setup breakpoints client-side
  useEffect(() => {
    updateVisibleCount(); // first client update

    window.addEventListener("resize", updateVisibleCount);
    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, [updateVisibleCount]);

  // Sync scroll buttons
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateDisabledStates();
    container.addEventListener("scroll", updateDisabledStates);

    return () => container.removeEventListener("scroll", updateDisabledStates);
  }, [items, visibleCount, updateDisabledStates]);

  return (
    <div className="relative w-full">
      {items.length > visibleCount && (
        <CarouselControls
          showCarousel={showCarousel}
          onNext={() => scrollByItem("next")}
          onPrev={() => scrollByItem("prev")}
          disableNext={disableNext}
          disablePrev={disablePrev}
        />
      )}

      <div className="relative w-full">
        <div
          ref={containerRef}
          className="flex overflow-x-auto scroll-smooth custom-scrollbar gap-2 "
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: `0 0 calc(${100 / visibleCount}% - 1rem)`,
              }}
            >
              {children(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
