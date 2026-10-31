"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/";

interface ValidationStateProps {
  isValid: boolean;
  message: string;
  className?: string;
}

/**
 * ValidationState
 * ----------------
 * Displays a small status indicator for a form step:
 * - Valid: green check icon
 * - Invalid/neutral: gray circle or red alert
 */
export const ValidationState = ({
  isValid,
  message,
  className = "",
}: ValidationStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-2 text-sm",
        className,
        isValid ? "text-green-600" : "text-gray-500"
      )}
    >
      {isValid ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      <span>{message}</span>
    </motion.div>
  );
};
