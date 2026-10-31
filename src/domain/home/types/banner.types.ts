export type Placement = "hero" | "home_top" | "home_middle"| "hero_side" |"category"
export interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  link?: string;
  alt?: string;
  desktopImage?: string;
  mobileImage?: string;
  cta: {
    type: "internal" | "external" | "category" | "product" | "custom";
    url?: string;
    slug?: string;
    _id?: string;
    openInNewTab?: boolean;
  };
  theme?: "light" | "dark" | "gradient";
  priority?: boolean; // For LCP optimization
  placement: Placement
}

export interface BannerProps {
  banners: BannerData[];
  sideBanners: BannerData[];

  // timing
  autoRotateInterval?: number; // default: 5000 (ms)

  // styling
  className?: string;

  // behavior
  onBannerClick?: (banner: BannerData, index: number) => void;
  enableKeyboardNavigation?: boolean;
  enableTouchGestures?: boolean;
  pauseOnHover?: boolean;
  lazyLoad?: boolean;

  // UI controls
  showIndicators?: boolean;
  showNavigationArrows?: boolean;

  // accessibility
  accessibilityLabels?: {
    nextSlide?: string;
    previousSlide?: string;
    slideIndicator?: string;
    pauseRotation?: string;
    resumeRotation?: string;
  };
}
export interface MobileBannerProps {
  banners: BannerData[];
  onBannerClick?: (banner: BannerData) => void;
  lazyLoad?: boolean;
  autoplayDelay?: number;
  className?: string;
}
