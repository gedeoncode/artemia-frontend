
export interface Category {
  id: string;
  name: string;
}
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  lensSize?: number;
  zoomScale?: number;
  lensShape?: "circle" | "square";
  thumbnailPosition?: "left" | "bottom";
  showToggle?: boolean;
}
