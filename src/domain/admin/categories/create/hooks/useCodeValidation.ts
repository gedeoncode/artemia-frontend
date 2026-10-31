"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "@/lib";

import type { SlugStatus } from "../types/category.types";

import { logger } from "@/lib/logger";
import { checkCategoryCodeApi } from "../services/client/createClientCategory.service";

interface UseCodeValidationProps {
  code: string;
  excludeId?: string;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

export function useCodeValidation({
  code,
  excludeId,
  onAvailabilityChange,
}: UseCodeValidationProps) {
  const [status, setStatus] = useState<SlugStatus>("idle");

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkCode = useMemo(
    () =>
      debounce(async (codeToCheck: string) => {
        if (!codeToCheck || codeToCheck.length < 2) {
          setStatus("idle");
          setIsAvailable(null);
          return;
        }

        // Normalize before validation
        const normalizedCode = codeToCheck.trim().toUpperCase();

        // Format validation
        if (!/^[A-Z0-9_-]+$/.test(normalizedCode)) {
          setStatus("invalid");
          setIsAvailable(false);
          onAvailabilityChange?.(false);
          return;
        }

        setStatus("checking");

        try {
          const { available } = await checkCategoryCodeApi(
            normalizedCode,
            excludeId,
          );

          setStatus(available ? "available" : "taken");

          setIsAvailable(available);

          onAvailabilityChange?.(available);
        } catch (error) {
          logger.error("Error checking category code:", error);

          setStatus("idle");
          setIsAvailable(null);

          onAvailabilityChange?.(false);
        }
      }, 500),
    [excludeId, onAvailabilityChange],
  );

  useEffect(() => {
    checkCode(code);

    return () => {
      checkCode.cancel();
    };
  }, [code, checkCode]);

  const getStatusMessage = useCallback(() => {
    switch (status) {
      case "checking":
        return "Checking code availability...";

      case "available":
        return "✓ Code is available";

      case "taken":
        return "✗ This code is already in use";

      case "invalid":
        return "Invalid format. Use uppercase letters, numbers, underscores, or hyphens";

      default:
        return "";
    }
  }, [status]);

  const getStatusColor = useCallback(() => {
    switch (status) {
      case "available":
        return "text-green-600";

      case "taken":
      case "invalid":
        return "text-red-600";

      case "checking":
        return "text-gray-500";

      default:
        return "text-gray-400";
    }
  }, [status]);

  return {
    status,
    isAvailable,
    getStatusMessage,
    getStatusColor,
    isValid: status === "available",
  };
}
