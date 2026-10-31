"use client";

import { cn } from "@/lib/utils/"; // Assuming you have a utility for class merging

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  children?: React.ReactNode;
  fadeDuration?: number;
}

export function Skeleton({
  className,
  isLoaded = false,
  children,
  fadeDuration = 300,
  ...props
}: SkeletonProps) {
  if (isLoaded) {
    return (
      <div
        className={cn("animate-fade-in", className)}
        style={{ animationDuration: `${fadeDuration}ms` }}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 rounded-md",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
      style={
        {
          "--shimmer-duration": "1.5s",
          ...props.style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
  lineClassName,
  ...props
}: SkeletonProps & {
  lines?: number;
  lineClassName?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full", lineClassName)} />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  headerClassName,
  contentClassName,
  ...props
}: SkeletonProps & {
  headerClassName?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={cn("rounded-lg border bg-white p-4 shadow-sm", className)}
      {...props}
    >
      <Skeleton className={cn("h-6 w-1/3 mb-3", headerClassName)} />
      <div className={cn("space-y-3", contentClassName)}>
        <SkeletonText lines={3} lineClassName="h-3" />
      </div>
    </div>
  );
}
