import { GalleryImage } from "@/domain/product/types/gallery.types";

// Image optimization utilities
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
    fit?: 'cover' | 'contain' | 'fill';
  }
): string => {
  // Implement CDN transformation logic
  // Example: image-service.com/optimize?url=...&w=...&q=...
  return url;
};

// Responsive image generator
export const generateImageSrcSet = (
  image: GalleryImage,
  breakpoints = [640, 768, 1024, 1280, 1536]
): string => {
  return breakpoints
    .map(width => `${getOptimizedImageUrl(image.url, { width })} ${width}w`)
    .join(', ');
};