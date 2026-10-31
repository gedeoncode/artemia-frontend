// components/MainImage/MainImage.tsx

'use client';

import { memo, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import styles from './ProductGallery.module.css';
import { GalleryImage } from './types/gallery.types';

interface MainImageProps {
  image: GalleryImage;
  isZoomed: boolean;
  zoomLevel: number;
  panX: number;
  panY: number;
  onZoomToggle: () => void;
  onLoad: () => void;
  onError: (error: Error) => void;
  priority: boolean;
  productName: string;
  index: number;
  total: number;
  prefersReducedMotion: boolean;
}

export const MainImage = memo<MainImageProps>(function MainImage({
  image,
  isZoomed,
  zoomLevel,
  panX,
  panY,
  onZoomToggle,
  onLoad,
  onError,
  priority,
  productName,
  index,
  total,
  prefersReducedMotion,
}: MainImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // --- Zoom Lens Effect ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed && isHovering) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    }
  }, [isZoomed, isHovering]);

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onZoomToggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onZoomToggle]);

  // --- Image source optimization ---
  const imageSrc = useMemo(() => {
    // Return WebP if supported, fallback to original
    return image.url;
  }, [image.url]);

  const imageSizes = useMemo(() => {
    return {
      mobile: '(max-width: 640px) 100vw',
      tablet: '(max-width: 1024px) 50vw',
      desktop: '(max-width: 1280px) 33vw',
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.mainImageWrapper}
      style={{
        cursor: isZoomed ? 'grab' : 'zoom-in',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onClick={onZoomToggle}
      role="img"
      aria-label={`${productName} - Image ${index + 1} of ${total}`}
      aria-roledescription="Product image"
    >
      <Image
        src={imageSrc}
        alt={`${productName} - Product view ${index + 1}`}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={styles.mainImage}
        style={{
          transform: isZoomed ? `scale(${zoomLevel}) translate(${panX}px, ${panY}px)` : undefined,
          transition: prefersReducedMotion ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onLoad={() => {
          setImageLoaded(true);
          onLoad();
        }}
        onError={() => {
          onError(new Error(`Failed to load image: ${image.id}`));
        }}
        // blurDataURL={image.blurDataURL}
        // placeholder="blur"
        loading={priority ? 'eager' : 'lazy'}
        quality={85}
      />

      {/* Zoom Lens */}
      {!isZoomed && isHovering && (
        <div
          className={styles.zoomLens}
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundSize: '300%',
            opacity: 0.7,
          }}
        />
      )}

      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button
          className={styles.zoomButton}
          onClick={(e) => {
            e.stopPropagation();
            onZoomToggle();
          }}
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          aria-pressed={isZoomed}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>

        {/* Fullscreen Button */}
        <button
          className={styles.zoomButton}
          onClick={(e) => {
            e.stopPropagation();
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              containerRef.current?.requestFullscreen();
            }
          }}
          aria-label="Toggle fullscreen"
        >
          {document.fullscreenElement ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>

      {/* Loading State */}
      {!imageLoaded && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}
    </div>
  );
});