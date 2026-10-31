"use client";

import Image from "next/image";

interface ThumbnailsProps {
  images:  string[];
  selectedImage: string ;
  onSelect: (image: string ) => void;
  toggleLensShape?: () => void;
  lensShape?: "circle" | "square";
  position?: "left" | "bottom";
  showToggle?: boolean;
  isMobile?: boolean;
}

export function Thumbnails({
  images,
  selectedImage,
  onSelect,
  toggleLensShape,
  lensShape = "square",
  position = "left",
  showToggle = true,
  isMobile ,
}: ThumbnailsProps) {
  const containerClass = position === "left" 
    ? "flex flex-row md:flex-col gap-2 order-1 md:order-none"
    : "flex flex-row gap-2 order-2";

  return (
    <div className={containerClass}>
      {images.map((image) => (
        <button
          key={image}
          onClick={() => onSelect(image)}
          className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
            selectedImage === image
              ? "border-blue-500 scale-105"
              : "border-transparent hover:border-blue-300"
          }`}
          aria-label={`Select product thumbnail`}
        >
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
            quality={50}
          />
        </button>
      ))}

      {showToggle && toggleLensShape &&  !isMobile &&(
        <button
          onClick={toggleLensShape}
          className="flex items-center justify-center w-16 h-16 transition-colors border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100"
          aria-label={`Toggle lens shape to ${lensShape === "square" ? "circle" : "square"}`}
          title={`Toggle lens shape (current: ${lensShape})`}
        >
          <div
            className={`w-8 h-8 ${
              lensShape === "square" ? "rounded-md" : "rounded-full"
            } bg-gradient-to-r from-red-900 via-blue-600 to-blue-500 transition-all duration-200`}
          />
        </button>
      )}
    </div>
  );
}


