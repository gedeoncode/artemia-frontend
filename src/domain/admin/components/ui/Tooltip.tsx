import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`
      z-50 overflow-hidden rounded-md border
      bg-white px-3 py-1.5 text-sm text-gray-700 shadow-md
      animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1
      data-[side=top]:slide-in-from-bottom-1
      data-[side=left]:slide-in-from-right-1
      data-[side=right]:slide-in-from-left-1
      ${className}
    `}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Main Tooltip component
export function Tooltip({
  children,
  content,
  delayDuration = 300,
  disableHoverableContent = false,
  ...props
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  disableHoverableContent?: boolean;
} & React.ComponentProps<typeof TooltipRoot>) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot disableHoverableContent={disableHoverableContent} {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent
            side="top"
            align="center"
            collisionPadding={10}
            avoidCollisions={true}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-white" />
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </TooltipRoot>
    </TooltipProvider>
  );
}

// Simplified version for common use cases
export function SimpleTooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Tooltip content={content}>
      <span className="inline-flex cursor-default">{children}</span>
    </Tooltip>
  );
}