import { BannerData } from "../types";

export const mockBanners: BannerData[] = [
  {
    id: "1",
    title: "Summer Sale",
    subtitle: "Get up to 50% off on selected items",
    image: {
      src: "/images/banner/banner 6.jpg",
      alt: "Summer sale banner",
      width: 1200,
      height: 600,
    },
    action: {
      type: "internal",
      url: "/sale",
    },
    theme: "gradient",
    priority: true,
  },
  {
    id: "2",
    title: "Summer Sale",
    subtitle: "Get up to 50% off on selected items",
    image: {
      src: "/images/products/speaker.jpg",
      alt: "Summer sale banner",
      width: 1200,
      height: 600,
    },
    action: {
      type: "internal",
      url: "/sale",
    },   
    theme: "gradient",
    priority: true,
  },
  {
    id: "3",
    title: "New Arrivals",
    subtitle: "Discover the latest collection",
    image: {
      src: "/images/banner/banner 2.jpg",
      alt: "New arrivals",
      width: 1200,
      height: 600,
    },
    action: {
      type: "category",
      slug: "new-arrivals",
    },
    theme: "light",
  },
  {
    id: "4",
    title: "Free Shipping",
    subtitle: "On orders over $50",
    image: {
      src: "/images/banner/banner 3.jpg",
      alt: "Free shipping",
      width: 1200,
      height: 800,
    },
    action: {
      type: "external",
      url: "https://www.example.com/shipping-info",
      openInNewTab: true,
    },
    theme: "dark",
  },
];
