import { useState } from 'react';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

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
        <div className="absolute z-10 w-48 p-2 mt-1 ml-1 text-xs text-white bg-gray-800 rounded-md shadow-lg left-full">
          {content}
        </div>
      )}
    </div>
  );
};