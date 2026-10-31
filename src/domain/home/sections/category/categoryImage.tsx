"use client";

import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

interface CategoryImageProps {
  src: string;
  alt: string;
  aspectRatio?: "aspect-square" | "aspect-[4/3]" | "aspect-[3/2]";
  className?: string;
  priority?: boolean;
}

export function CategoryImage({
  src,
  alt,
  aspectRatio = "aspect-square",
  className,
  priority = false,
}: CategoryImageProps) {

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800",
        aspectRatio,
        className,
      )}
    >
     
      <ProgressiveImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
