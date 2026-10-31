// utils/galleryUtils.ts

import type { GalleryImage, ViewportType } from "../types/gallery.types";

/**
 * Get the optimized image URL with CDN transformation
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpeg" | "png";
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    crop?: "center" | "top" | "bottom" | "left" | "right" | "focal";
  } = {},
): string {
  // If the URL already has query parameters, handle accordingly
  const hasQuery = url.includes("?");
  const separator = hasQuery ? "&" : "?";

  const params = new URLSearchParams();

  if (options.width) params.set("w", String(options.width));
  if (options.height) params.set("h", String(options.height));
  if (options.quality) params.set("q", String(options.quality));
  if (options.format) params.set("fm", options.format);
  if (options.fit) params.set("fit", options.fit);
  if (options.crop) params.set("crop", options.crop);

  // Check for WebP/AVIF support
  const supportsWebP =
    typeof document !== "undefined" &&
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .startsWith("data:image/webp");
  const supportsAvif =
    typeof document !== "undefined" &&
    document
      .createElement("canvas")
      .toDataURL("image/avif")
      .startsWith("data:image/avif");

  // Auto-select best format
  if (!options.format) {
    if (supportsAvif) {
      params.set("fm", "avif");
    } else if (supportsWebP) {
      params.set("fm", "webp");
    }
  }

  const queryString = params.toString();
  return queryString ? `${url}${separator}${queryString}` : url;
}

/**
 * Generate responsive srcSet for images
 */
export function generateImageSrcSet(
  image: GalleryImage,
  breakpoints: number[] = [320, 480, 640, 768, 1024, 1280, 1536, 1920],
): string {
  return breakpoints
    .map((width) => {
      const optimizedUrl = getOptimizedImageUrl(image.url, {
        width,
        fit: "cover",
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(", ");
}

/**
 * Get viewport type based on window width
 */
export function getViewportType(): ViewportType {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;

  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Debounce function for resize and scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll and touch events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

/**
 * Calculate optimal thumbnail grid layout
 */
export function calculateThumbnailLayout(
  totalImages: number,
  containerWidth: number,
  thumbnailSize: number,
  gap: number,
  maxVisible: number = 20,
): {
  visibleCount: number;
  rows: number;
  cols: number;
  totalPages: number;
} {
  // Calculate max columns based on container width
  const maxCols = Math.floor((containerWidth + gap) / (thumbnailSize + gap));
  const cols = Math.min(maxCols, 6); // Max 6 columns
  const rows = Math.ceil(Math.min(totalImages, maxVisible) / cols);
  const totalPages = Math.ceil(totalImages / (cols * rows));

  return {
    visibleCount: Math.min(totalImages, cols * rows),
    rows,
    cols,
    totalPages,
  };
}

/**
 * Check if an element is in viewport
 */
export function isInViewport(
  element: HTMLElement,
  offset: number = 0,
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom >= -offset &&
    rect.top <= windowHeight + offset &&
    rect.right >= -offset &&
    rect.left <= windowWidth + offset
  );
}

/**
 * Get image dimensions from URL (if available)
 */
export function getImageDimensions(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    img.src = url;
  });
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate gradient placeholder for images
 */
export function generateGradientPlaceholder(
  dominantColor: string = "#e5e7eb",
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='${encodeURIComponent(dominantColor)}'/%3E%3C/svg%3E`;
}

/**
 * Get image badge priority order
 */
export function getBadgePriority(badges: ImageBadge[]): ImageBadge[] {
  const priorityOrder = ["sale", "bestseller", "new", "custom"];
  return badges.sort((a, b) => {
    return priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type);
  });
}

/**
 * Detect if image is video
 */
export function isVideoImage(image: GalleryImage): boolean {
  return image.isVideo === true || !!(image.videoUrl || image.videoThumbnail);
}

/**
 * Detect if image is 360 view
 */
export function is360Image(image: GalleryImage): boolean {
  return image.is360 === true || !!(image.frames && image.frames.length > 0);
}

/**
 * Generate unique ID for gallery images
 */
export function generateGalleryId(): string {
  return `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate gallery image object
 */
export function validateGalleryImage(image: any): image is GalleryImage {
  return (
    typeof image === "object" &&
    image !== null &&
    typeof image.id === "string" &&
    typeof image.url === "string" &&
    (typeof image.thumbnailUrl === "string" || typeof image.url === "string") &&
    typeof image.alt === "string"
  );
}

/**
 * Get image dimensions for responsive sizing
 */
export function getResponsiveImageSizes(viewportType: ViewportType): string {
  switch (viewportType) {
    case "mobile":
      return "100vw";
    case "tablet":
      return "50vw";
    case "desktop":
      return "33vw";
    default:
      return "100vw";
  }
}
