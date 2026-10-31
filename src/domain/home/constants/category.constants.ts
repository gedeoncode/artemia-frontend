export const CATEGORY_SECTION = {
  DEFAULT_TITLE: 'Shop by Category',
  DEFAULT_SUBTITLE: 'Explore our curated collections',
  HERO_COUNT: 2,
  MOBILE_COLUMNS: 2,
  TABLET_COLUMNS: 3,
  DESKTOP_COLUMNS: 5,
  MAX_DESKTOP_COLUMNS: 8,
  IMAGE_ASPECT_RATIO: {
    HERO: 'aspect-[4/3]',
    STANDARD: 'aspect-square',
  },
} as const;

export const CATEGORY_GRID_BREAKPOINTS = {
  mobile: 2,
  tablet: 3,
  desktop: 5,
  largeDesktop: 8,
} as const;

export const ANIMATION_DURATIONS = {
  HOVER: 'duration-300',
  EXIT: 'duration-200',
} as const;