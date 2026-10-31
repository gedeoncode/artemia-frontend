// components/ProductHeroSection/ProductGallery/ProductGallery.tsx
"use client";

import { memo, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Images } from "@/types";

interface ProductGalleryProps {
  images: Images;
  productName: string;
  priority?: boolean;
}

export const ProductGallery = memo(function ProductGallery({
  images,
  productName,
  priority = false,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handlePrevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleZoomToggle = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
        onClick={handleZoomToggle}
        role="img"
        aria-label={`${productName} - Image ${selectedIndex + 1} of ${images.length}`}
      >
        <Image
          src={images[selectedIndex].url}
          alt={productName}
          fill
          priority={priority || selectedIndex === 0}
          className="object-contain transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {selectedIndex + 1} / {images.length}
          </span>
        )}

        {/* Zoom Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomToggle();
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <ZoomIn className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-x-auto scrollbar-hide"
        >
          {images.map((image, index) => (
            <button
              key={image.publicId || index}
              onClick={() => handleThumbnailClick(index)}
              className={`
                relative aspect-square rounded-md overflow-hidden
                transition-all duration-200
                ${
                  selectedIndex === index
                    ? "ring-2 ring-primary-500 ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }
              `}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : "false"}
            >
              <Image
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});