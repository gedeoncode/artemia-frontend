"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CarouselControls = ({
  showCarousel,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: {
  showCarousel: boolean;
  onPrev: () => void;
  onNext: () => void;
  disablePrev: boolean;
  disableNext: boolean;
}) => {
  return (
    <>
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={disablePrev}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex 
          items-center justify-center w-10 h-20 rounded-sm bg-white/100 
          shadow-lg transition-all
          ${disablePrev ? "opacity-40 cursor-not-allowed hover:scale-100" : "hover:scale-105"}

          ${
            showCarousel
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }
        `}
        aria-label="Previous items"
      >
        <FiChevronLeft className="w-8 h-8 text-gray-500" />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={disableNext}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex 
          items-center justify-center w-10 h-20 rounded-sm bg-white/100 
          shadow-lg transition-all
          ${disableNext ? "opacity-40 cursor-not-allowed hover:scale-100" : "hover:scale-105"}

          ${
            showCarousel
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none"
          }
        `}
        aria-label="Next items"
      >
        <FiChevronRight className="w-8 h-8 text-gray-500" />
      </button>
    </>
  );
};

export default CarouselControls;
