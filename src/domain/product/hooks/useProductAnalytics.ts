import { useCallback } from "react";

export function useProductAnalytics({ enabled }: { enabled: boolean }) {
  const trackProductView = useCallback(async (data: any) => {
    if (!enabled) return;
    // Implement analytics tracking (e.g., Google Analytics, Mixpanel, etc.)
    console.log("Product view tracked:", data);
  }, [enabled]);

  const trackProductImpression = useCallback((productId: string) => {
    if (!enabled) return;
    // Implement impression tracking
    console.log("Product impression:", productId);
  }, [enabled]);

  return { trackProductView, trackProductImpression };
}