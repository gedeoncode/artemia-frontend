"use client";

import Link from "next/link";
import Carousel from "@/components/ui/caroussel/Carousel";
import { VISIBLE_COUNTS } from "@/constants/counts";
import { useHoverToggle } from "@/hooks/useShowCarousel";
import { BaseProduct as Product } from "@/types/product/product.types";

type CarouselSectionProps<T> = {
  title?: string;
  link?: string;
  items: Product[];
  renderItem: (item: Product) => React.ReactNode;
  renderMobileItem?: (item: Product) => React.ReactNode;
  className?: string;
};

export function CarouselSection<T>({
  title,
  link,
  items,
  renderItem,
  renderMobileItem,
  className = "",
}: CarouselSectionProps<T>) {
  const { isHovered, eventHandlers } = useHoverToggle();

  return (
    <div
      className={`layout-space surface-card ${className}`}
      {...eventHandlers}
    >
      {/* Header (optional) */}
      {(title || link) && (
        <div
          className="flex items-center justify-between w-full px-3 py-3 sm:px-4 sm:py-3 md:px-6 border-b border-slate-100 gap-3"
          role="heading"
          aria-level={2}
        >
          {title && (
            <h2 className="gradient-text font-semibold truncate text-base sm:text-lg md:text-xl lg:text-2xl sm:font-bold flex-1 min-w-0">
              {title}
            </h2>
          )}
          {link && (
            <Link
              href={link}
              className="ml-auto text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1 sm:px-3"
              aria-label={`View all ${title || "items"}`}
            >
              View all
              <span className="sr-only"> {title}</span>
            </Link>
          )}
        </div>
      )}

      {/* 📱 Mobile */}
      <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:hidden">
        {items.map((item, i) => (
          <div key={(item as Product)._id ?? i} className="w-full">
            {renderMobileItem ? renderMobileItem(item) : renderItem(item)}
          </div>
        ))}
      </div>

      {/* 🖥 Desktop & Tablet */}
      <div className="hidden md:block px-2 sm:px-0 py-2 sm:py-3">
        <Carousel
          items={items}
          breakpoints={VISIBLE_COUNTS}
          showCarousel={true}
        >
          {(item) => renderItem(item)}
        </Carousel>
      </div>
    </div>
  );
}
