"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";

interface ModalZoomProps {
  isOpen: boolean;
  images: string[];
  index: number;
  onChange: (newIndex: number) => void;
  onClose: () => void;
  description?: string;
  title?: string;
}

export function ModalZoom({
  isOpen,
  images,
  index,
  onChange,
  onClose,
  description,
  title,
}: ModalZoomProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Refs for gesture detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const current = images[index];

  // Disable scroll on body and manage focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";

      // Store the currently focused element to return focus on close
      const previouslyFocused = document.activeElement as HTMLElement;
      modalRef.current?.focus();

      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);

  // Calculate scrollbar width to prevent layout shift
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    );
  }, [isOpen]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setImageError(false);
    onChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onChange]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setImageError(false);
    onChange((index + 1) % images.length);
  }, [index, images.length, onChange]);
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goPrev();
          break;
        case "ArrowRight":
          goNext();
          break;
      }
    },
    [isOpen, onClose, goNext, goPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Enhanced swipe detection with vertical swipe prevention
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = touchX - touchStartX.current;
    const deltaY = touchY - touchStartY.current;

    // Only consider it swiping if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
      isSwiping.current = true;
      e.preventDefault(); 
    }

    touchEndX.current = touchX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || !touchStartX.current) return;

    const delta = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;

    if (Math.abs(delta) < minSwipeDistance) return;

    if (delta > 0) {
      goPrev();
    } else {
      goNext();
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
    isSwiping.current = false;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Click outside to close (with improved detection)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      tabIndex={-1}
    >
      <div
        className="relative w-full h-full max-w-7xl max-h-[95vh] p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold truncate">
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-description"
                className="text-sm text-gray-300 truncate"
              >
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            className="flex-shrink-0 p-2 transition-all duration-200 rounded-full bg-black/50 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-black"
            onClick={onClose}
            aria-label="Close zoom modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute z-10 p-3 text-white transition-all duration-200 -translate-y-1/2 rounded-full left-2 md:left-4 top-1/2 bg-black/50 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={goPrev}
              disabled={images.length <= 1}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              className="absolute z-10 p-3 text-white transition-all duration-200 -translate-y-1/2 rounded-full right-2 md:right-4 top-1/2 bg-black/50 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={goNext}
              disabled={images.length <= 1}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

        {/* Main Image Container */}
        <div
          ref={imageContainerRef}
          className="relative w-full h-full mt-12 mb-20 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white rounded-full border-t-transparent animate-spin" />
            </div>
          )}

          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg">Failed to load image</p>
            </div>
          ) : (
            <Image
              src={current}
              alt={title || "Zoomed image view"}
              fill
              className="object-contain transition-opacity duration-300"
              style={{ opacity: isLoading ? 0 : 1 }}
              quality={100}
              priority
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            />
          )}
        </div>

        {/* Footer with Image Counter and Thumbnails */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            {/* Image Counter */}
            <div className="text-sm text-white">
              {index + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto max-w-[60%] hide-scrollbar">
                {images.map((image, i) => (
                  <button
                    key={i}
                    className={`flex-shrink-0 w-12 h-12 transition-all duration-200 border-2 rounded ${
                      i === index
                        ? "border-white scale-110"
                        : "border-transparent hover:border-white/50 opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => {
                      if (i !== index) {
                        setIsLoading(true);
                        setImageError(false);
                        onChange(i);
                      }
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={image}
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
