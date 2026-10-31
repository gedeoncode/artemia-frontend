// domain/admin/products/hooks/useRejectDialog.ts

"use client";

import { useCallback, useState } from "react";

export function useRejectDialog() {
  const [isOpen, setIsOpen] =
    useState(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,

    openDialog,
    closeDialog,
  };
}