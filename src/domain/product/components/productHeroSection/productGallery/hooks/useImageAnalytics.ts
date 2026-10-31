// hooks/useImageAnalytics.ts

import { GalleryImage } from "@/domain/product/types/gallery.types";
import { useCallback } from "react";

interface AnalyticsConfig {
  enabled: boolean;
  productName: string;
  images: GalleryImage[];
}

export function useImageAnalytics({ enabled, productName, images }: AnalyticsConfig) {
  const trackImageView = useCallback((index: number) => {
    if (!enabled) return;
    
    const image = images[index];
    // Send to analytics service
    analytics.track('product_image_view', {
      productName,
      imageIndex: index,
      imageId: image.id,
      variant: image.variant || 'default',
      isVideo: !!image.isVideo,
    });
  }, [enabled, productName, images]);

  const trackZoomInteraction = useCallback(({ zoomed }: { zoomed: boolean }) => {
    if (!enabled) return;
    
    analytics.track('product_image_zoom', {
      productName,
      zoomed,
      interactionType: 'click',
    });
  }, [enabled, productName]);

  const trackGalleryNavigation = useCallback(({
    fromIndex,
    toIndex,
    method,
  }: {
    fromIndex: number;
    toIndex: number;
    method: 'arrow' | 'thumbnail' | 'swipe' | 'keyboard';
  }) => {
    if (!enabled) return;
    
    analytics.track('product_gallery_navigation', {
      productName,
      fromIndex,
      toIndex,
      method,
      totalImages: images.length,
    });
  }, [enabled, productName, images.length]);

  return {
    trackImageView,
    trackZoomInteraction,
    trackGalleryNavigation,
  };
}