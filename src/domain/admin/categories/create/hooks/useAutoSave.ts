"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { categoryApi } from "../services/createCategory.services";
import type { SaveStatus, CategoryFormData } from "../types/category.types";
import { debounce } from "@/lib";

interface UseAutoSaveProps {
  formData: Partial<CategoryFormData>;
  isDirty: boolean;
  enabled?: boolean;
  delay?: number;
  onSave?: (data: Partial<CategoryFormData>) => Promise<void>;
  onSaveComplete?: (status: SaveStatus) => void;
}

export function useAutoSave({
  formData,
  isDirty,
  enabled = true,
  delay = 3000,
  onSave,
  onSaveComplete,
}: UseAutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initialDataRef = useRef(formData);

  const autoSave = useCallback(async () => {
    if (!enabled || !isDirty) return;

    setSaveStatus("saving");
    setError(null);

    try {
      if (onSave) {
        await onSave(formData);
      } else {
        // Default save implementation
        await categoryApi.saveDraft(formData);
      }

      setSaveStatus("saved");
      setLastSaved(new Date());
      initialDataRef.current = formData;

      // Reset status after 2 seconds
      setTimeout(() => {
        if (saveStatus === "saved") {
          setSaveStatus("idle");
        }
      }, 2000);
    } catch (err) {
      setSaveStatus("error");
      setError(err instanceof Error ? err.message : "Auto-save failed");
    } finally {
      onSaveComplete?.(saveStatus);
    }
  }, [formData, isDirty, enabled, onSave, onSaveComplete, saveStatus]);

  const debouncedAutoSave = useMemo(
    () => debounce(autoSave, delay),
    [autoSave, delay],
  );
  // Trigger auto-save when form data changes
  useEffect(() => {
    if (enabled && isDirty) {
      debouncedAutoSave();
    }

    return () => {
      debouncedAutoSave.cancel();
    };
  }, [formData, isDirty, enabled, debouncedAutoSave]);

  // Manual save
  const manualSave = useCallback(async () => {
    debouncedAutoSave.cancel();
    await autoSave();
  }, [autoSave, debouncedAutoSave]);

  const getSaveStatusMessage = useCallback(() => {
    switch (saveStatus) {
      case "saving":
        return "Saving draft...";
      case "saved":
        return "All changes saved";
      case "error":
        return error || "Failed to save";
      default:
        return lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : "";
    }
  }, [saveStatus, error, lastSaved]);

  const getSaveStatusColor = useCallback(() => {
    switch (saveStatus) {
      case "saving":
        return "text-yellow-600";
      case "saved":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  }, [saveStatus]);

  return {
    saveStatus,
    lastSaved,
    error,
    manualSave,
    getSaveStatusMessage,
    getSaveStatusColor,
    isAutoSaving: saveStatus === "saving",
  };
}
