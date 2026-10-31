import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface UseZoomControllerOptions {
  lensSize: number;
  zoomScale: number;

  /** Enable smoothing (recommended) */
  smooth?: boolean;

  /** Easing factor: 0 = instant, 0.1 = smooth, 0.2 = very smooth */
  ease?: number;
}

export interface ZoomState {
  isZooming: boolean;
  lensX: number;
  lensY: number;
  bgX: number;
  bgY: number;
}

export function useZoomController({
  lensSize,
  zoomScale,
  smooth = true,
  ease = 0.18,
}: UseZoomControllerOptions) {
  const [zoomState, setZoomState] = useState<ZoomState>({
    isZooming: false,
    lensX: 0,
    lensY: 0,
    bgX: 0,
    bgY: 0,
  });

  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  // Target values (cursor exact)
  const target = useRef({
    lensX: 0,
    lensY: 0,
    bgX: 0,
    bgY: 0,
  });

  // Smoothed values (UI rendered)
  const smoothState = useRef({
    lensX: 0,
    lensY: 0,
    bgX: 0,
    bgY: 0,
  });

  // -------------------------------------------------
  // MEASURE RECT — stable layout measurement
  // -------------------------------------------------
  const measureRect = useCallback(() => {
    if (!containerRef.current) return;
    rectRef.current = containerRef.current.getBoundingClientRect();
  }, []);

  useLayoutEffect(() => {
    measureRect();
    window.addEventListener("resize", measureRect);
    return () => window.removeEventListener("resize", measureRect);
  }, [measureRect]);

  // -------------------------------------------------
  // SMOOTH ANIMATION LOOP
  // -------------------------------------------------
  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);

    if (!smooth) {
      setZoomState((prev) => ({
        ...prev,
        ...target.current,
      }));
      return;
    }

    // lerp (linear interpolation)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    smoothState.current.lensX = lerp(
      smoothState.current.lensX,
      target.current.lensX,
      ease
    );
    smoothState.current.lensY = lerp(
      smoothState.current.lensY,
      target.current.lensY,
      ease
    );
    smoothState.current.bgX = lerp(
      smoothState.current.bgX,
      target.current.bgX,
      ease
    );
    smoothState.current.bgY = lerp(
      smoothState.current.bgY,
      target.current.bgY,
      ease
    );

    setZoomState((prev) => ({
      ...prev,
      lensX: smoothState.current.lensX,
      lensY: smoothState.current.lensY,
      bgX: smoothState.current.bgX,
      bgY: smoothState.current.bgY,
    }));
  }, [ease, smooth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // -------------------------------------------------
  // ZOOM START / STOP
  // -------------------------------------------------
  const startZoom = useCallback(() => {
    setZoomState((prev) => ({ ...prev, isZooming: true }));
  }, []);

  const stopZoom = useCallback(() => {
    setZoomState((prev) => ({ ...prev, isZooming: false }));
  }, []);

  // -------------------------------------------------
  // UPDATE LOGIC — shared between mouse and touch
  // -------------------------------------------------
  const updateZoomInternal = useCallback(
    (clientX: number, clientY: number) => {
      if (!rectRef.current) return;

      const rect = rectRef.current;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Lens bounds
      const maxX = rect.width - lensSize;
      const maxY = rect.height - lensSize;

      const lensX = Math.max(0, Math.min(x - lensSize / 2, maxX));
      const lensY = Math.max(0, Math.min(y - lensSize / 2, maxY));

      // Lens center
      const centerX = lensX + lensSize / 2;
      const centerY = lensY + lensSize / 2;

      // Background position percentage
      const rawBgX = (centerX / rect.width) * 100;
      const rawBgY = (centerY / rect.height) * 100;

      const bgX = Math.max(0, Math.min(rawBgX, 100));
      const bgY = Math.max(0, Math.min(rawBgY, 100));

      // Save for smooth loop to animate
      target.current = { lensX, lensY, bgX, bgY };
    },
    [lensSize]
  );

  // -------------------------------------------------
  // PUBLIC HANDLERS
  // -------------------------------------------------
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!zoomState.isZooming) return;
      updateZoomInternal(e.clientX, e.clientY);
    },
    [zoomState.isZooming, updateZoomInternal]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!zoomState.isZooming || e.touches.length === 0) return;
      const t = e.touches[0];
      updateZoomInternal(t.clientX, t.clientY);
    },
    [zoomState.isZooming, updateZoomInternal]
  );

  return {
    containerRef,
    zoomState,
    startZoom,
    stopZoom,
    handleMouseMove,
    handleTouchMove,
    measureRect,
  };
}
