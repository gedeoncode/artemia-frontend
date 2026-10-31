"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  PropsWithChildren,
} from "react";
import { useStepper } from "@/domain/seller/products/add/hooks";

export interface StepperContextValue {
  currentStep: number;
  next: () => Promise<boolean>;
  prev: () => void;
  jumpTo: (step: number) => void;
  reset: () => void;

  // Step validity management
  registerStepValidity: (step: number, isValid: boolean) => void;
  isStepValid: (step: number) => boolean;
  stepValidity: Record<number, boolean>;

  // Flags
  isFirst: boolean;
  isLast: boolean;
}

const StepperContext = createContext<StepperContextValue | null>(null);

interface StepperProviderProps extends PropsWithChildren {
  /** Total steps in the flow (0-based index) */
  totalSteps: number;
  /** Optional callback for analytics/autosave/etc. */
  onStepChange?: (newStep: number, prevStep: number) => void;
}

export function StepperProvider({
  totalSteps,
  onStepChange,
  children,
}: StepperProviderProps) {
  const stepper = useStepper({
    maxStep: totalSteps - 1,
    onStepChange,
  });

  const value = useMemo<StepperContextValue>(
    () => ({
      currentStep: stepper.currentStep,
      next: stepper.next,
      prev: stepper.prev,
      jumpTo: stepper.jumpTo,
      reset: stepper.reset,
      registerStepValidity: stepper.registerStepValidity,
      isStepValid: stepper.isStepValid,
      stepValidity: stepper.stepValidity,
      isFirst: stepper.isFirst,
      isLast: stepper.isLast,
    }),
    [stepper],
  );

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
}

/**
 * useStepperContext — Hook for child components to access stepper state.
 */
export function useStepperContext() {
  const ctx = useContext(StepperContext);
  if (!ctx) {
    throw new Error(
      "useStepperContext must be used within a <StepperProvider>",
    );
  }
  return ctx;
}
