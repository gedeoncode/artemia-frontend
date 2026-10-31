"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { debounce } from "@/lib";
import type { SlugStatus } from "../types/category.types";
import { logger } from "@/lib/logger";
import { checkCategorySlugApi } from "../services/client/createClientCategory.service";

interface UseSlugValidationProps {
  slug: string;
  excludeId?: string;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

export function useSlugValidation({
  slug,
  excludeId,
  onAvailabilityChange,
}: UseSlugValidationProps) {
  const [status, setStatus] = useState<SlugStatus>("idle");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkSlug = useMemo(
    () =>
      debounce(async (slugToCheck: string) => {
        if (!slugToCheck || slugToCheck.length < 3) {
          setStatus("idle");
          setIsAvailable(null);
          return;
        }

        // Basic format validation
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugToCheck)) {
          setStatus("invalid");
          setIsAvailable(false);
          onAvailabilityChange?.(false);
          return;
        }

        setStatus("checking");

        try {
          const { available } = await checkCategorySlugApi(
            slugToCheck,
            excludeId,
          );

          setStatus(available ? "available" : "taken");
          setIsAvailable(available);
          onAvailabilityChange?.(available);
        } catch (error) {
          logger.error("Error", error);
          setStatus("idle");
          setIsAvailable(null);
          onAvailabilityChange?.(false);
        }
      }, 500),
    [excludeId, onAvailabilityChange],
  );

  useEffect(() => {
    checkSlug(slug);
    return () => {
      checkSlug.cancel();
    };
  }, [slug, checkSlug]);

  const getStatusMessage = useCallback(() => {
    switch (status) {
      case "checking":
        return "Checking availability...";
      case "available":
        return "✓ URL is available";
      case "taken":
        return "✗ This URL is already taken";
      case "invalid":
        return "Invalid format. Use lowercase letters, numbers, and hyphens";
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
