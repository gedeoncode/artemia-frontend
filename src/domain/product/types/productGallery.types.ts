export interface ProductGalleryProps {
  images: string[];
  title: string;
  description?: string;
  lensSize?: number;
  zoomScale?: number;
  lensShape?: "circle" | "square";
  thumbnailPosition?: "left" | "bottom";
  showToggle?: boolean;
}
