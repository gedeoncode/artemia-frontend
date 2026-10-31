"use client";

import { UserIntent } from "@/types";
import { useEffect, useState } from "react";

const STORAGE_KEY = "signup_intent";

const isValidPreauthIntent = (value: string): value is UserIntent => {
  return Object.values(UserIntent).includes(value as UserIntent);
};

export const usePreauthIntent = () => {
  const [preauthIntent, setPreauthIntent] = useState<UserIntent | null>(null);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);

      if (stored && isValidPreauthIntent(stored)) {
        setPreauthIntent(stored);
      } else {
        setPreauthIntent(null);
      }
    } catch {
      setPreauthIntent(null);
    }
  }, []);

  const savePreauthIntent = (intent: UserIntent) => {
    sessionStorage.setItem(STORAGE_KEY, intent);
    setPreauthIntent(intent);
  };

  const clearPreauthIntent = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPreauthIntent(null);
  };

  return {
    preauthIntent,
    savePreauthIntent,
    clearPreauthIntent,
  };
};
