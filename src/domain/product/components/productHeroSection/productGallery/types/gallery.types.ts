// types/gallery.types.ts

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  width: number;
  height: number;
  publicId?: string;
  blurDataURL?: string;
  dominantColor?: string;
  badges?: ImageBadge[];
  variant?: string;
  isVideo?: boolean;
  videoUrl?: string;
  is360?: boolean;
}

export interface GalleryState {
  currentIndex: number;
  isZoomed: boolean;
  zoomLevel: number;
  panX: number;
  panY: number;
  isFullscreen: boolean;
  isLoading: boolean;
  error: Error | null;
  viewport: 'mobile' | 'tablet' | 'desktop';
}


export interface ImageBadge {
  id: string;
  type: 'sale' | 'bestseller' | 'new' | 'custom';
  label: string;
  color?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export type ViewportType = 'mobile' | 'tablet' | 'desktop';

// --- Component Props ---

export interface ProductGalleryConfig {
  /** Array of product images to display */
  images: GalleryImage[];
  
  /** Product name for accessibility and analytics */
  productName: string;
  
  /** Initial image index to display */
  initialIndex?: number;
  
  /** Whether to prioritize loading the first image */
  priority?: boolean;
  
  /** Enable zoom functionality */
  enableZoom?: boolean;
  
  /** Enable keyboard navigation */
  enableKeyboardNavigation?: boolean;
  
  /** Enable swipe gestures on mobile */
  enableSwipe?: boolean;
  
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  
  /** Number of thumbnails to show at once */
  thumbnailCount?: number;
  
  /** Number of images to preload ahead and behind */
  preloadCount?: number;
  
  /** Callback when image changes */
  onImageChange?: (index: number) => void;
  
  /** Callback when zoom state changes */
  onZoomChange?: (isZoomed: boolean) => void;
  
  /** Callback when fullscreen state changes */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  
  /** Custom CSS class name */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** ARIA label for the gallery */
  ariaLabel?: string;
  
  /** Whether to show navigation arrows */
  showNavigation?: boolean;
  
  /** Whether to show image counter */
  showCounter?: boolean;
  
  /** Whether to show zoom controls */
  showZoomControls?: boolean;
  
  /** Badge configuration */
  badgeConfig?: {
    maxDisplay?: number;
    position?: 'top-left' | 'top-right';
    showIcons?: boolean;
  };
  
  /** Thumbnail configuration */
  thumbnailConfig?: {
    position?: 'bottom' | 'left' | 'right';
    size?: 'small' | 'medium' | 'large';
    showScrollButtons?: boolean;
    autoScroll?: boolean;
  };
  
  /** Zoom configuration */
  zoomConfig?: {
    maxZoomLevel?: number;
    zoomStep?: number;
    showMagnifier?: boolean;
    magnifierSize?: number;
    doubleClickToZoom?: boolean;
  };
  
  /** Fullscreen configuration */
  fullscreenConfig?: {
    enabled?: boolean;
    closeOnEscape?: boolean;
    showControls?: boolean;
  };
  
  /** Analytics configuration */
  analyticsConfig?: {
    trackImpressions?: boolean;
    trackInteractions?: boolean;
    trackErrors?: boolean;
    eventPrefix?: string;
    customProperties?: Record<string, any>;
  };
  
  /** Performance configuration */
  performanceConfig?: {
    lazyLoadThreshold?: number;
    preconnectDomains?: string[];
    imageQuality?: number;
    enableWebP?: boolean;
    enableAVIF?: boolean;
  };
  
  /** Accessibility configuration */
  a11yConfig?: {
    announceImageChanges?: boolean;
    enableKeyboardShortcuts?: boolean;
    showShortcutsHelp?: boolean;
    focusOnMount?: boolean;
    trapFocus?: boolean;
  };
  
  /** Error handling configuration */
  errorConfig?: {
    fallbackImage?: string;
    retryLimit?: number;
    showErrorBoundary?: boolean;
  };
  
  /** Children for custom rendering */
  children?: ReactNode;
}


export enum GalleryActionType {
  SET_INDEX = 'SET_INDEX',
  NEXT_IMAGE = 'NEXT_IMAGE',
  PREV_IMAGE = 'PREV_IMAGE',
  TOGGLE_ZOOM = 'TOGGLE_ZOOM',
  SET_ZOOM_LEVEL = 'SET_ZOOM_LEVEL',
  SET_PAN = 'SET_PAN',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_VIEWPORT = 'SET_VIEWPORT',
  TOGGLE_FULLSCREEN = 'TOGGLE_FULLSCREEN',
  SET_DRAGGING = 'SET_DRAGGING',
  SET_THUMBNAIL_SCROLL = 'SET_THUMBNAIL_SCROLL',
}

export interface GalleryAction {
  type: GalleryActionType;
  payload?: any;
}

// --- Gallery Context Types ---

export interface GalleryContextValue {
  state: GalleryState;
  dispatch: React.Dispatch<GalleryAction>;
  images: GalleryImage[];
  currentImage: GalleryImage;
  totalImages: number;
  nextImage: () => void;
  prevImage: () => void;
  setIndex: (index: number) => void;
  toggleZoom: () => void;
  setZoomLevel: (level: number) => void;
  setPan: (x: number, y: number) => void;
  toggleFullscreen: () => void;
  setError: (error: Error | null) => void;
  viewport: ViewportType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// --- Analytics Types ---

export interface GalleryAnalyticsEvent {
  name: string;
  properties: {
    productName: string;
    imageIndex: number;
    imageId: string;
    totalImages: number;
    viewport: ViewportType;
    variant?: string;
    isVideo?: boolean;
    is360?: boolean;
    [key: string]: any;
  };
}

export type GalleryAnalyticsCallback = (event: GalleryAnalyticsEvent) => void;

// --- Performance Types ---

export interface GalleryPerformanceMetrics {
  initialLoadTime: number;
  imageLoadTimes: Map<string, number>;
  navigationTimings: Map<string, number>;
  zoomTimings: Map<string, number>;
  totalTimeToInteractive: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

// --- Testing Types ---

export interface GalleryTestIds {
  root?: string;
  mainImage?: string;
  thumbnails?: string;
  navigation?: string;
  zoomControls?: string;
  badges?: string;
  counter?: string;
  loadingSkeleton?: string;
  errorState?: string;
}

// --- Utility Types ---

export type GalleryEventHandler = (event: React.SyntheticEvent) => void;
export type GalleryImageEventHandler = (image: GalleryImage, index: number) => void;
export type GalleryIndexEventHandler = (index: number) => void;
export type GalleryErrorEventHandler = (error: Error, image?: GalleryImage) => void;