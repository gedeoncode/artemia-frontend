"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import { ProductGalleryProps } from "../../types";
import { getHighResUrl } from "../../utils";
import { ModalZoom,ZoomPreview, ZoomLens, ThumbnailStrip } from "./";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useZoomController, useHighResImage } from "../../hooks";
import { useBreakpoints } from "@/hooks";

export function ProductGallery({
  images,
  title,
  description,
  lensSize = 80,
  zoomScale = 2.5,
  lensShape: initialShape = "square",
  thumbnailPosition = "left",
  showToggle = true,
}: ProductGalleryProps) {
  if (!images || images.length === 0) throw new Error("Missing images");

  const containerRef = useRef<HTMLDivElement>(null);
  const {isMobile} = useBreakpoints()
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [lensShape, setLensShape] = useLocalStorage<"circle" | "square">(
    "lensShape",
    initialShape
  );

  const { naturalSize, measureNaturalResolution } = useHighResImage();

  const zoomHighResUrl = useMemo(
    () => getHighResUrl(selectedImage),
    [selectedImage]
  );

  const {
    zoomState,
    containerRef: zoomContainerRef,
    startZoom,
    stopZoom,
    handleMouseMove,
    handleTouchMove,
    measureRect,
  } = useZoomController({ lensSize, zoomScale });

  zoomContainerRef.current = containerRef.current;

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    measureRect();
    measureNaturalResolution(zoomHighResUrl);
  }, [
    selectedImage,
    zoomHighResUrl,
    measureRect,
    measureNaturalResolution,
  ]);

  const onSelect = useCallback(
    (img: string) => {
      setSelectedImage(img);
      stopZoom();
      requestAnimationFrame(() => measureRect());
    },
    [stopZoom, measureRect]
  );

  const toggleLensShape = useCallback(() => {
    setLensShape((p) => (p === "circle" ? "square" : "circle"));
  }, [setLensShape]);

  const effectiveZoom = useMemo(() => {
    const container = containerRef.current;
    if (!container) return zoomScale;

    const renderedWidth = container.offsetWidth;
    if (!naturalSize.width) return zoomScale;

    const maxScale = naturalSize.width / renderedWidth;
    return Math.min(Math.max(zoomScale, 1), Math.max(zoomScale, maxScale));
  }, [naturalSize.width, zoomScale]);

  const zoomStyle = useMemo(() => {
    if (!zoomState.isZooming) return {};

    return {
      backgroundImage: `url(${zoomHighResUrl})`,
      backgroundPosition: `${zoomState.bgX}% ${zoomState.bgY}%`,
      backgroundSize: `${effectiveZoom * 100}%`,
      backgroundRepeat: "no-repeat",
    };
  }, [zoomState, zoomHighResUrl, effectiveZoom]);

  const containerClass =
    thumbnailPosition === "left"
      ? "flex flex-col gap-6 md:flex-row items-start"
      : "flex flex-col gap-6";

  return (
    <div className="relative select-none">
      <div className={containerClass}>
        <ThumbnailStrip
          images={images}
          selectedImage={selectedImage}
          onSelect={onSelect}
          toggleLensShape={toggleLensShape}
          lensShape={lensShape}
          position={thumbnailPosition}
          showToggle={showToggle}
          isMobile={isMobile}
        />

        {/* MAIN IMAGE */}
        <div ref={containerRef} className="relative w-full">
          <div
            onClick={() => setShowZoomModal(true)}
            onMouseMove={handleMouseMove}
            onMouseEnter={startZoom}
            onMouseLeave={stopZoom}
            onTouchStart={startZoom}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopZoom}
            className="relative overflow-hidden bg-white rounded-lg aspect-square cursor-zoom-in w-full h-full min-h-[320px]"
          >
            {zoomState.isZooming && !isMobile && (
              <ZoomLens
                lensSize={lensSize}
                lensShape={lensShape}
                x={zoomState.lensX}
                y={zoomState.lensY}
              />
            )}
          
              <Image
                src={selectedImage}
                alt={ title}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 800px"
                priority
                quality={85}
                placeholder="blur"
                blurDataURL={images[0]}
                onLoad={() => requestAnimationFrame(measureRect)}
              />
        
          </div>

          {!isTouchDevice && (
            <div className="absolute z-10 px-2 py-1 text-xs text-white rounded bottom-2 right-2 bg-black/50 backdrop-blur-sm">
              Click to zoom
            </div>
          )}
        </div>
      </div>

      {zoomState.isZooming && !isTouchDevice &&  !isMobile && (
        <ZoomPreview zoomStyle={zoomStyle} />
      )}

      <ModalZoom
        isOpen={showZoomModal}
        images={images}
        index={images.findIndex((i) => i === selectedImage)}
        onChange={(newIndex) => {
          const next = images[newIndex];
          setSelectedImage(next);
        }}
        onClose={() => setShowZoomModal(false)}
        title={title}
        description={description}
      />
    </div>
  );
}
