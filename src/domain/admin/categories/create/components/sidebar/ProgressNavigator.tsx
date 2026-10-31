"use client";

import { useFormContext } from "react-hook-form";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  section: string;
}

const navItems: NavItem[] = [
  { id: "basic", label: "Basic Information", section: "basic" },
  { id: "commerce", label: "Commerce Settings", section: "commerce" },
  { id: "seo", label: "SEO & URL", section: "seo" },
  { id: "rules", label: "Rules & Automation", section: "rules" },
  { id: "media", label: "Media", section: "media" },
  { id: "advanced", label: "Advanced", section: "advanced" },
];

interface ProgressNavigatorProps {
  className?: string;
  onNavigate?: (sectionId: string) => void;
}

export function ProgressNavigator({
  className,
  onNavigate,
}: ProgressNavigatorProps) {
  const {
    formState: { errors },
    watch,
  } = useFormContext();

  // Track which sections have errors
  const hasSectionErrors = (sectionId: string): boolean => {
    switch (sectionId) {
      case "basic":
        return !!errors.name || !!errors.parent;
      case "seo":
        return !!errors.slug;
      case "rules":
        return !!errors.allowedModes;
      case "media":
        return !!errors.image;
      default:
        return false;
    }
  };

  // Track which sections are complete
  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case "basic":
        return !!watch("name");
      case "seo":
        return !!watch("slug");
      case "rules":
        return watch("allowedModes")?.length > 0;
      default:
        return false;
    }
  };

  const getSectionStatus = (sectionId: string) => {
    if (hasSectionErrors(sectionId)) return "error";
    if (isSectionComplete(sectionId)) return "complete";
    return "pending";
  };

  return (
    <nav className={cn("sticky top-24", className)}>
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Navigation
        </p>

        {navItems.map((item) => {
          const status = getSectionStatus(item.id);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                status === "error" && "text-red-600 hover:bg-red-50",
              )}
            >
              {status === "complete" && (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              {status === "pending" && (
                <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
              )}
              {status === "error" && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}

              <span className="flex-1 text-left">{item.label}</span>

              {status === "error" && (
                <span className="text-xs text-red-500">!</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Completion</span>
          <span>
            {navItems.filter((item) => isSectionComplete(item.id)).length}/
            {navItems.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${(navItems.filter((item) => isSectionComplete(item.id)).length / navItems.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
