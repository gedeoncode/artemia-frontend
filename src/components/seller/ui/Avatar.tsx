import * as React from "react"
import { cn } from "@/lib/utils/"
import Image from "next/image";

const Avatar = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    src?: string
    alt?: string
    fallback?: React.ReactNode
  }
>(({ className, src, alt, fallback, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-r from-red-900/20 via-blue-600/20 to-purple-600/20",
      className
    )}
    {...props}
  >
    {src ? (
      <Image
        className="object-cover w-full h-full aspect-square"
        src={src}
        alt={alt ?? ""}
        fill
      />
    ) : (
      <span className="flex items-center justify-center w-full h-full rounded-full bg-muted">
        {fallback}
      </span>
    )}
  </span>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, width, height, ...props }, ref) => {
  if (!src) return null;
  return (
    <Image
      ref={ref as React.Ref<HTMLImageElement>}
      className={cn("aspect-square h-full w-full", className)}
      src={src}
      alt="Avatar"
      width={typeof width === "number" ? width : 40}
      height={typeof height === "number" ? height : 40}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };