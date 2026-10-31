// hooks/useImagePreloader.ts

import { useEffect, useRef, useState, useCallback } from "react";
import type { GalleryImage } from "../types/gallery.types";

interface PreloadStatus {
  loaded: Set<string>;
  loading: Set<string>;
  errors: Set<string>;
}

export function useImagePreloader({
  images,
  currentIndex,
  preloadCount = 3,
  priority = false,
}: {
  images: GalleryImage[];
  currentIndex: number;
  preloadCount?: number;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<PreloadStatus>({
    loaded: new Set(),
    loading: new Set(),
    errors: new Set(),
  });

  const preloadQueue = useRef<string[]>([]);

  const preloadImage = useCallback(
    (image: GalleryImage) => {
      if (status.loaded.has(image.id) || status.loading.has(image.id)) {
        return Promise.resolve();
      }

      setStatus((prev) => ({
        ...prev,
        loading: new Set(prev.loading).add(image.id),
      }));

      return new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.src = image.url;
        img.onload = () => {
          setStatus((prev) => ({
            loaded: new Set(prev.loaded).add(image.id),
            loading: new Set(prev.loading),
            loading: new Set(prev.loading).delete(image.id),
            errors: new Set(prev.errors),
          }));
          resolve();
        };
        img.onerror = () => {
          setStatus((prev) => ({
            ...prev,
            loading: new Set(prev.loading).delete(image.id),
            errors: new Set(prev.errors).add(image.id),
          }));
          reject(new Error(`Failed to preload image: ${image.id}`));
        };
      });
    },
    [status.loaded, status.loading],
  );

  // Preload images around current index
  useEffect(() => {
    if (!images.length) return;

    const indicesToPreload = [];
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentIndex + i;
      const prevIndex = currentIndex - i;
      if (nextIndex < images.length) {
        indicesToPreload.push(nextIndex);
      }
      if (prevIndex >= 0) {
        indicesToPreload.push(prevIndex);
      }
    }

    // Prioritize next images
    const uniqueIndices = [...new Set(indicesToPreload)];
    const priorityImages = uniqueIndices
      .filter((index) => index > currentIndex)
      .map((index) => images[index]);
    const nonPriorityImages = uniqueIndices
      .filter((index) => index < currentIndex)
      .map((index) => images[index]);

    const imagesToPreload = [...priorityImages, ...nonPriorityImages];

    // Preload with progressive enhancement
    imagesToPreload.forEach((image, index) => {
      if (priority && index < 2) {
        // High priority preload
        preloadImage(image).catch(() => {
          // Silent fail - will be caught by error boundary
        });
      } else {
        // Low priority preload with requestIdleCallback
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(() => {
            preloadImage(image).catch(() => {
              // Silent fail
            });
          });
        } else {
          setTimeout(() => {
            preloadImage(image).catch(() => {
              // Silent fail
            });
          }, 1000);
        }
      }
    });

    // Preload current image if not already
    const currentImage = images[currentIndex];
    if (currentImage && !status.loaded.has(currentImage.id)) {
      preloadImage(currentImage).catch(() => {
        // Handle error
      });
    }
  }, [
    images,
    currentIndex,
    preloadCount,
    preloadImage,
    priority,
    status.loaded,
  ]);

  return {
    preloadStatus: status,
    isPreloaded: (imageId: string) => status.loaded.has(imageId),
    isPreloading: (imageId: string) => status.loading.has(imageId),
    hasError: (imageId: string) => status.errors.has(imageId),
  };
}
