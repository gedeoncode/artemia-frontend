// components/product/FormWarning.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Warning {
  id: string;
  type: "info" | "warning" | "error";
  message: string;
}

interface FormWarningProps {
  warnings: Warning[];
  className?: string;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

const severityConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    iconColor: "text-red-500",
  },
};

export function FormWarning({
  warnings,
  className,
  onDismiss,
  compact = false,
}: FormWarningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const sortedWarnings = useMemo(() => {
    const order = { error: 0, warning: 1, info: 2 };
    return [...warnings].sort((a, b) => order[a.type] - order[b.type]);
  }, [warnings]);

  if (warnings.length === 0) {
    return null;
  }

  const severity = useMemo(() => {
    if (warnings.some((w) => w.type === "error")) return "error";
    if (warnings.some((w) => w.type === "warning")) return "warning";
    return "info";
  }, [warnings]);

  const config = severityConfig[severity];
  const Icon = config.icon;
  const totalWarnings = warnings.length;
  const visibleWarnings = isExpanded
    ? warnings
    : warnings.slice(0, compact ? 1 : 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-lg border p-4",
        config.bgColor,
        config.borderColor,
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.iconColor)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn("text-sm font-medium", config.textColor)}>
              {totalWarnings} {totalWarnings === 1 ? "issue" : "issues"} found
            </h4>
            {warnings.length > (compact ? 1 : 2) && (
              <button
                type="button"
                onClick={toggleExpand}
                className={cn(
                  "flex items-center gap-1 text-xs font-medium transition-colors hover:underline",
                  config.textColor,
                )}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Show less" : "Show more"}
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            <motion.div
              className="mt-2 space-y-1"
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={{
                expanded: {
                  transition: { staggerChildren: 0.05 },
                },
                collapsed: {
                  transition: { staggerChildren: 0, staggerDirection: -1 },
                },
              }}
            >
              {visibleWarnings.map((warning, index) => (
                <motion.div
                  key={warning.id || index}
                  variants={{
                    expanded: {
                      opacity: 1,
                      height: "auto",
                      marginBottom: "0.25rem",
                    },
                    collapsed: {
                      opacity: 0,
                      height: 0,
                      marginBottom: 0,
                    },
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-2 overflow-hidden"
                >
                  <span className="text-sm text-gray-700">
                    {warning.message}
                  </span>
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={() => onDismiss(warning.id)}
                      className="flex-shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600"
                      aria-label={`Dismiss warning: ${warning.message}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {!compact && totalWarnings > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-gray-200/50 pt-3">
          {warnings.some((w) => w.type === "error") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              <AlertCircle className="h-3 w-3" />
              {warnings.filter((w) => w.type === "error").length}
            </span>
          )}
          {warnings.some((w) => w.type === "warning") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              {warnings.filter((w) => w.type === "warning").length}
            </span>
          )}
          {warnings.some((w) => w.type === "info") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              <Info className="h-3 w-3" />
              {warnings.filter((w) => w.type === "info").length}
            </span>
          )}
          <span className="text-xs text-gray-500">
            Resolve all issues before publishing
          </span>
        </div>
      )}
    </motion.div>
  );
}
