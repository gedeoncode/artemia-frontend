"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface StepperOptions {
  /** Total number of steps (e.g., 5 → steps 0–4) */
  maxStep: number;
  /** Query parameter name (defaults to "step") */
  paramName?: string;
  /** Optional callback (analytics, autosave, etc.) */
  onStepChange?: (newStep: number, prevStep: number) => void;
}

export const useStepper = ({
  maxStep,
  paramName = "step",
  onStepChange,
}: StepperOptions) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ────────────────────────────────
  // 1. Parse current step from URL
  // ────────────────────────────────
  const currentStep = useMemo(() => {
    const step = Number(searchParams.get(paramName));
    if (isNaN(step)) return 0;
    return Math.min(Math.max(step, 0), maxStep);
  }, [searchParams, paramName, maxStep]);

  // ────────────────────────────────
  // 2. Step validity state (controlled by each step)
  // ────────────────────────────────
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({});

  const registerStepValidity = useCallback((step: number, isValid: boolean) => {
    
 
    setStepValidity((prev) =>
      prev[step] === isValid ? prev : { ...prev, [step]: isValid }
    );
    
  }, []);

  const isStepValid = useCallback(
    (step: number) => !!stepValidity[step],
    [stepValidity]
  );

  // ────────────────────────────────
  // 3. Update step in URL (without reload)
  // ────────────────────────────────
  const updateStepInUrl = useCallback(
    (newStep: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(paramName, String(newStep));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, paramName]
  );

  // ────────────────────────────────
  // 4. Navigation helpers
  // ────────────────────────────────
  const next = useCallback(async () => {
    const canMove = isStepValid(currentStep);

    if (!canMove) {
      console.warn(`[useStepper] Step ${currentStep} is invalid.`);
      return false;
    }

    const nextStep = Math.min(currentStep + 1, maxStep);
    if (nextStep !== currentStep) {
      updateStepInUrl(nextStep);
      onStepChange?.(nextStep, currentStep);
    }

    return true;
  }, [currentStep, isStepValid, maxStep, updateStepInUrl, onStepChange]);

  const prev = useCallback(() => {
    const prevStep = Math.max(currentStep - 1, 0);
    if (prevStep !== currentStep) {
      updateStepInUrl(prevStep);
      onStepChange?.(prevStep, currentStep);
    }
  }, [currentStep, updateStepInUrl, onStepChange]);

  const jumpTo = useCallback(
    (step: number) => {
      const safeStep = Math.min(Math.max(step, 0), maxStep);
      if (safeStep !== currentStep) {
        updateStepInUrl(safeStep);
        onStepChange?.(safeStep, currentStep);
      }
    },
    [currentStep, maxStep, onStepChange, updateStepInUrl]
  );
  // ────────────────────────────────
  // 5. Public API
  // ────────────────────────────────
  return {
    currentStep,
    next,
    prev,
    jumpTo,
    reset: () => jumpTo(0),

    // Step validity
    registerStepValidity,
    isStepValid,
    stepValidity,

    // Step state flags
    isFirst: currentStep === 0,
    isLast: currentStep === maxStep,
  } as const;
};
