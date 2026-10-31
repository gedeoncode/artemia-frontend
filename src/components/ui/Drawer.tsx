"use client";

import * as React from "react";
import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils/";

// Root
export const Drawer = DrawerPrimitive.Root;

// Trigger
export const DrawerTrigger = DrawerPrimitive.Trigger;

// Portal wrapper
export const DrawerPortal = DrawerPrimitive.Portal;

// Overlay
export const DrawerOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
        className
      )}
      {...props}
    />
  )
);
DrawerOverlay.displayName = "DrawerOverlay";

// Content (bottom sheet style)
export const DrawerContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-xl border bg-background p-0 shadow-lg",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-10",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
);
DrawerContent.displayName = "DrawerContent";

// Header
export function DrawerHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 border-b", className)}
      {...props}
    />
  );
}

// Title
export const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

// Description (optional)
export const DrawerDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;
