'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/';

interface SectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  children: ReactNode;
  validationErrors?: string[];
  warningCount?: number;
  className?: string;
}

export function Section({
  title,
  description,
  icon,
  collapsible = true,
  defaultExpanded = true,
  children,
  validationErrors = [],
  warningCount = 0,
  className
}: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasErrors = validationErrors.length > 0;
  
  return (
    <div className={cn(
      "group rounded-lg border border-gray-200 bg-white transition-all",
      hasErrors && "border-red-200",
      className
    )}>
      <div
        className={cn(
          "flex items-start justify-between p-4 transition-colors",
          collapsible && "cursor-pointer hover:bg-gray-50",
          hasErrors && "hover:bg-red-50"
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn(
                "text-gray-400",
                hasErrors && "text-red-400"
              )}>
                {icon}
              </div>
            )}
            <div>
              <h3 className={cn(
                "text-sm font-medium",
                hasErrors ? "text-red-900" : "text-gray-900"
              )}>
                {title}
              </h3>
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {hasErrors && (
            <Badge variant="danger" className="text-xs gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {warningCount > 0 && !hasErrors && (
            <Badge variant="warning" className="text-xs gap-1">
              <AlertCircle className="w-3 h-3" />
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {collapsible && (
            <button
            type='button'
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}