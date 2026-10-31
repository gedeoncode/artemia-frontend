// hooks/useGallery.ts

import { useReducer, useCallback, useEffect, useMemo } from "react";
import type {
  GalleryImage,
  GalleryState,
  GalleryAction,
} from "../types/gallery.types";

const initialState: GalleryState = {
  currentIndex: 0,
  isZoomed: false,
  zoomLevel: 1,
  panX: 0,
  panY: 0,
  isFullscreen: false,
  isLoading: true,
  error: null,
  viewport: "desktop",
};

function galleryReducer(
  state: GalleryState,
  action: GalleryAction,
): GalleryState {
  switch (action.type) {
    case "SET_INDEX":
      return {
        ...state,
        currentIndex: action.payload,
        isLoading: true,
        error: null,
      };
    case "NEXT_IMAGE": {
      const nextIndex = state.currentIndex + 1;
      return {
        ...state,
        currentIndex: nextIndex,
        isLoading: true,
        error: null,
        isZoomed: false,
        zoomLevel: 1,
        panX: 0,
        panY: 0,
      };
    }
    case "PREV_IMAGE": {
      const prevIndex = state.currentIndex - 1;
      return {
        ...state,
        currentIndex: prevIndex,
        isLoading: true,
        error: null,
        isZoomed: false,
        zoomLevel: 1,
        panX: 0,
        panY: 0,
      };
    }
    case "TOGGLE_ZOOM":
      return {
        ...state,
        isZoomed: !state.isZoomed,
        zoomLevel: state.isZoomed ? 1 : 2.5,
        panX: 0,
        panY: 0,
      };
    case "SET_ZOOM_LEVEL":
      return {
        ...state,
        zoomLevel: Math.max(1, Math.min(5, action.payload)),
      };
    case "SET_PAN":
      return {
        ...state,
        panX: action.payload.x,
        panY: action.payload.y,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "SET_VIEWPORT":
      return {
        ...state,
        viewport: action.payload,
      };
    default:
      return state;
  }
}

export function useGallery(config: {
  images: GalleryImage[];
  initialIndex?: number;
  enableZoom?: boolean;
}) {
  const { images, initialIndex = 0, enableZoom = true } = config;
  const [state, dispatch] = useReducer(galleryReducer, {
    ...initialState,
    currentIndex: initialIndex,
  });

  const setIndex = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, images.length - 1));
      dispatch({ type: "SET_INDEX", payload: validIndex });
    },
    [images.length],
  );

  const nextImage = useCallback(() => {
    const maxIndex = images.length - 1;
    if (state.currentIndex < maxIndex) {
      dispatch({ type: "NEXT_IMAGE" });
    } else {
      // Loop to beginning if requested
      // dispatch({ type: 'SET_INDEX', payload: 0 });
    }
  }, [state.currentIndex, images.length]);

  const prevImage = useCallback(() => {
    if (state.currentIndex > 0) {
      dispatch({ type: "PREV_IMAGE" });
    } else {
      // Loop to end if requested
      // dispatch({ type: 'SET_INDEX', payload: images.length - 1 });
    }
  }, [state.currentIndex]);

  const toggleZoom = useCallback(() => {
    if (enableZoom) {
      dispatch({ type: "TOGGLE_ZOOM" });
    }
  }, [enableZoom]);

  const setZoomLevel = useCallback((level: number) => {
    dispatch({ type: "SET_ZOOM_LEVEL", payload: level });
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    dispatch({ type: "SET_PAN", payload: { x, y } });
  }, []);

  const setError = useCallback((error: Error | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  // Detect viewport
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      let viewport: "mobile" | "tablet" | "desktop";
      if (width < 640) viewport = "mobile";
      else if (width < 1024) viewport = "tablet";
      else viewport = "desktop";
      dispatch({ type: "SET_VIEWPORT", payload: viewport });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return {
    state,
    setIndex,
    nextImage,
    prevImage,
    toggleZoom,
    setZoomLevel,
    setPan,
    setError,
  };
}
