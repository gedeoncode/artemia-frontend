// ui/ErrorMessage.tsx
import { FieldError } from "react-hook-form";

interface ErrorMessageProps {
  error?: FieldError;
  id?: string;
  className?: string;
}

export const ErrorMessage = ({
  error,
  id,
  className = "",
}: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <p id={id} className={`text-sm text-red-600 ${className}`} role="alert">
      {error.message}
    </p>
  );
};

// ui/HelpText.tsx
interface HelpTextProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const HelpText = ({ children, id, className = "" }: HelpTextProps) => (
  <p id={id} className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

// ui/Tooltip.tsx
import { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

// ui/Skeleton.tsx
interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);
