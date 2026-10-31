"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { User, Check, Crown, Shield } from "lucide-react";
function getAvatarFallback(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(" ");

    // John Doe -> JD
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    // John -> J
    return parts[0][0].toUpperCase();
  }

  if (email) {
    return email[0].toUpperCase();
  }

  return "?";
}
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-24 w-24 text-2xl",
      },
      border: {
        none: "",
        subtle: "ring-1 ring-border",
        light: "ring-2 ring-white/20",
        colored: "ring-2 ring-primary",
      },
      status: {
        none: "",
        online:
          "after:absolute after:bottom-0 after:right-0 after:block after:h-2.5 after:w-2.5 after:rounded-full after:bg-emerald-500 after:ring-2 after:ring-background",
        offline:
          "after:absolute after:bottom-0 after:right-0 after:block after:h-2.5 after:w-2.5 after:rounded-full after:bg-gray-400 after:ring-2 after:ring-background",
        away: "after:absolute after:bottom-0 after:right-0 after:block after:h-2.5 after:w-2.5 after:rounded-full after:bg-amber-500 after:ring-2 after:ring-background",
        busy: "after:absolute after:bottom-0 after:right-0 after:block after:h-2.5 after:w-2.5 after:rounded-full after:bg-red-500 after:ring-2 after:ring-background",
      },
    },
    defaultVariants: {
      size: "md",
      border: "none",
      status: "none",
    },
  },
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  email?: string;
  fallback?: string;
  icon?: React.ReactNode;
  badge?: "verified" | "premium" | "admin";
  onError?: () => void;
}

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, border, status, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, border, status }), className)}
    {...props}
  />
));
AvatarRoot.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/80 font-medium text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children || <User className="h-1/2 w-1/2" />}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const AvatarBadge = ({
  type,
  className,
}: {
  type: "verified" | "premium" | "admin";
  className?: string;
}) => {
  const badges = {
    verified: {
      icon: Check,
      className: "bg-emerald-500 text-white",
      tooltip: "Verified Account",
    },
    premium: {
      icon: Crown,
      className: "bg-amber-500 text-white",
      tooltip: "Premium Member",
    },
    admin: {
      icon: Shield,
      className: "bg-blue-500 text-white",
      tooltip: "Administrator",
    },
  };

  const BadgeIcon = badges[type].icon;

  return (
    <div
      className={cn(
        "absolute -bottom-0.5 -right-0.5 rounded-full p-0.5 ring-2 ring-background",
        badges[type].className,
        className,
      )}
    >
      <BadgeIcon className="h-2.5 w-2.5" />
    </div>
  );
};

const EnhancedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      src,
      alt,
      name,
      email,
      fallback,
      badge,
      icon,
      onError,
      children,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);

    const computedFallback =
      fallback || getAvatarFallback(name, email);

    return (
      <div className="relative inline-block">
        <AvatarRoot ref={ref} {...props}>
          {src && !imgError ? (
            <AvatarImage
              src={src}
              alt={alt}
              onError={() => {
                setImgError(true);
                onError?.();
              }}
            />
          ) : null}

          <AvatarFallback delayMs={600}>
            {icon || computedFallback}
          </AvatarFallback>

          {children}
        </AvatarRoot>

        {badge && <AvatarBadge type={badge} />}
      </div>
    );
  }
);
EnhancedAvatar.displayName = "EnhancedAvatar";

// Group component for multiple avatars
const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    max?: number;
    spacing?: "sm" | "md" | "lg";
  }
>(({ className, children, max = 5, spacing = "md", ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  const displayedChildren = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  const spacingClasses = {
    sm: "-space-x-2",
    md: "-space-x-3",
    lg: "-space-x-4",
  };

  return (
    <div
      ref={ref}
      className={cn("flex", spacingClasses[spacing], className)}
      {...props}
    >
      {displayedChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full transition-transform hover:translate-y-[-2px] hover:z-10"
        >
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background">
          +{remaining}
        </div>
      )}
    </div>
  );
});
AvatarGroup.displayName = "AvatarGroup";

export {
  EnhancedAvatar as Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarVariants,
};
