import { cn } from "@/lib";

export const sizeClasses = {
  sm: cn(
    "h-8", // 32px
    "px-3",
    "text-xs",
    "gap-1.5",
    // Icon sizing
    "[&_svg]:size-3.5",
  ),
  md: cn(
    "h-10", // 40px
    "px-4",
    "text-sm",
    "gap-2",
    // Icon sizing
    "[&_svg]:size-4",
  ),
  lg: cn(
    "h-11", // 44px (accessible but not oversized)
    "px-6",
    "text-base",
    "gap-2.5",
    // Icon sizing
    "[&_svg]:size-4.5",
  ),
};


export const variantClasses = {
  primary: cn(
    "bg-gradient-to-r from-blue-600 to-blue-400 text-white",
    "hover:from-blue-700 hover:to-blue-500",
    "active:from-blue-800 active:to-blue-600",
    "transition-all duration-200 ease-out",
    "hover:shadow-md",
    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  secondary: cn(
    "bg-purple-600 text-white",
    "hover:bg-purple-700",
    "active:bg-purple-800",
    "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  outline: cn(
    "border border-blue-500 text-blue-600 bg-transparent",
    "hover:bg-blue-50",
    "active:bg-blue-100",
    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  ),

  danger: cn(
    "bg-red-600 text-white",
    "hover:bg-red-700",
    "active:bg-red-800",
    "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  destructive: cn(
    "bg-red-600 text-white",
    "hover:bg-red-700",
    "active:bg-red-800",
    "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  success: cn(
    "bg-green-600 text-white",
    "hover:bg-green-700",
    "active:bg-green-800",
    "focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  archive: cn(
    "bg-amber-500 text-white",
    "hover:bg-amber-600",
    "active:bg-amber-700",
    "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  ghost: cn(
    "text-gray-700 bg-transparent",
    "hover:bg-gray-100",
    "active:bg-gray-200",
    "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
  ),

  link: cn(
    "text-blue-600 bg-transparent",
    "hover:underline",
    "active:text-blue-800",
    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "px-0", // Remove padding for link style
    "h-auto", // Let height be natural
  ),

  warning: cn(
    "bg-yellow-600 text-white",
    "hover:bg-yellow-700",
    "active:bg-yellow-800",
    "focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  info: cn(
    "bg-cyan-600 text-white",
    "hover:bg-cyan-700",
    "active:bg-cyan-800",
    "focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2",
    "shadow-sm",
  ),

  neutral: cn(
    "bg-white text-gray-800 border border-gray-300",
    "hover:bg-gray-50",
    "active:bg-gray-100",
    "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
  ),

  black: cn(
    "bg-black text-white",
    "hover:bg-gray-900",
    "active:bg-gray-800",
    "focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2",
    "shadow-sm",
  ),
};