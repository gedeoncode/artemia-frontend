"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CategoryFormData } from "../types/category.types";

interface UseDirtyStateProps {
  formData: Partial<CategoryFormData>;
  initialData: Partial<CategoryFormData>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function useDirtyState({
  formData,
  initialData,
  onDirtyChange,
}: UseDirtyStateProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Set<keyof CategoryFormData>>(
    new Set(),
  );
  const initialDataRef = useRef(initialData);

  // Track changes
  const trackChanges = useCallback(() => {
    const newDirtyFields = new Set<keyof CategoryFormData>();

    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof CategoryFormData;
      const currentValue = formData[fieldKey];
      const initialValue = initialDataRef.current[fieldKey];

      // Deep comparison for objects/arrays
      const isEqual =
        JSON.stringify(currentValue) === JSON.stringify(initialValue);

      if (
        !isEqual &&
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ""
      ) {
        newDirtyFields.add(fieldKey);
      }
    });

    setDirtyFields(newDirtyFields);
    const dirty = newDirtyFields.size > 0;
    setIsDirty(dirty);
    onDirtyChange?.(dirty);
  }, [formData, onDirtyChange]);

  // Watch for changes
  useEffect(() => {
    trackChanges();
  }, [formData, trackChanges]);

  // Reset dirty state
  const resetDirty = useCallback(
    (newInitialData?: Partial<CategoryFormData>) => {
      if (newInitialData) {
        initialDataRef.current = newInitialData;
      }
      setDirtyFields(new Set());
      setIsDirty(false);
      onDirtyChange?.(false);
    },
    [onDirtyChange],
  );

  // Check if specific field is dirty
  const isFieldDirty = useCallback(
    (field: keyof CategoryFormData) => {
      return dirtyFields.has(field);
    },
    [dirtyFields],
  );

  // Show warning on navigation if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return {
    isDirty,
    dirtyFields: Array.from(dirtyFields),
    resetDirty,
    isFieldDirty,
  };
}
