// components/product/ProductImages.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Images } from "@/types";

interface ProductImagesProps {
  images: Images;
  name: string;
  className?: string;
}

const TRANSITION_DURATION = 0.25;

export function ProductImages({ images, name, className }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const imageArray = Array.isArray(images) ? images : [];
  const hasImages = imageArray.length > 0;
  const selectedImage = hasImages ? imageArray[selectedIndex] : null;

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsLoading(true);
  }, []);

  const handleNext = useCallback(() => {
    if (hasImages) {
      setSelectedIndex((prev) => (prev + 1) % imageArray.length);
      setIsLoading(true);
    }
  }, [hasImages, imageArray.length]);

  const handlePrevious = useCallback(() => {
    if (hasImages) {
      setSelectedIndex(
        (prev) => (prev - 1 + imageArray.length) % imageArray.length,
      );
      setIsLoading(true);
    }
  }, [hasImages, imageArray.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsZoomed(false);
    },
    [handleNext, handlePrevious],
  );

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      // Ensure thumbnail scroll position is maintained
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[selectedIndex];
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!handleTouchStart.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - handleTouchStart.current.x;
      const deltaY = touch.clientY - handleTouchStart.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        e.preventDefault();
        if (deltaX > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
        handleTouchStart.current = null;
      }
    },
    [handleNext, handlePrevious],
  );

  if (!hasImages) {
    return <EmptyState name={name} />;
  }

  return (
    <div
      ref={containerRef}
      className={cn("space-y-4", className)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Product images gallery"
    >
      {/* Main Image */}
      <div
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
        onTouchStart={(e) => {
          handleTouchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          handleTouchStart.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: TRANSITION_DURATION }}
            className="relative h-full w-full cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          >
            <Image
              src={selectedImage?.url || ""}
              alt={`${name} - Image ${selectedIndex + 1}`}
              fill
              className={cn(
                "object-contain transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100",
              )}
              priority={selectedIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && <Skeleton />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {hasImages && imageArray.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {selectedIndex + 1} / {imageArray.length}
            </div>
          </>
        )}

        {/* Zoom Indicator */}
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnail Carousel */}
      {hasImages && imageArray.length > 1 && (
        <div className="relative">
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            role="tablist"
            aria-label="Image thumbnails"
          >
            {imageArray.map((image, index) => (
              <button
                type="button"
                key={image.url || index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                role="tab"
                aria-selected={selectedIndex === index}
                aria-label={`View image ${index + 1}`}
                onClick={() => handleSelect(index)}
                className={cn(
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  selectedIndex === index
                    ? "border-blue-500 shadow-md"
                    : "border-transparent hover:border-gray-300",
                )}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {selectedIndex === index && (
                  <motion.div
                    layoutId="activeThumbnail"
                    className="absolute inset-0 border-2 border-blue-500"
                    transition={{ duration: TRANSITION_DURATION }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative h-full max-h-[90vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage?.url || ""}
                alt={`${name} - Zoomed view`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
              />
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-all hover:bg-white/30"
                aria-label="Close zoom"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="absolute inset-0 animate-pulse bg-gray-200">
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

function EmptyState({ name }: { name: string }) {
  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <ImageOff className="mb-4 h-12 w-12 text-gray-400" />
      <p className="text-sm font-medium text-gray-700">No images uploaded</p>
      <p className="mt-1 text-xs text-gray-500">
        Add images to showcase {name || "your product"}
      </p>
    </div>
  );
}
