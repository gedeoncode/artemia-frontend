"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useOtpVerification } from "@/hooks/registration/useOtpVerification";
import {
  OTP_LENGTH,
  REGISTRATION_SESSION,
  RESEND_COOLDOWN,
  VERIFY_DEBOUNCE_MS,
} from "@/constants/index";
import { useRegistrationStepGuard } from "./useRegistrationGuard";
import { handlePostAuthRedirect } from "@/lib/utils/navigation/handlePostAuthRedirect";
import { useCountdown } from "./useCountdown";

type SessionData = {
  sessionId: string;
  email: string;
};

export function useOtpVerificationController() {
  const router = useRouter();

  const [sessionData] = useLocalStorage<SessionData>(REGISTRATION_SESSION, {
    sessionId: "",
    email: "",
  });
  const { checking, signupIntent } = useRegistrationStepGuard(
    sessionData.sessionId,
    "OTP",
  );

  const {
    loading,
    resendLoading,
    requestLoading,
    verifyOtp,
    requestOtp,
    error,
    message,
    clearOtp,
  } = useOtpVerification({
    sessionId: sessionData.sessionId,
  });

  const {
    seconds: resendTimer,
    running: resendRunning,
    start: startResendCountdown,
    reset: resetResendCountdown,
  } = useCountdown();

  /** ---------------------------
   * Local UI state
   * --------------------------- */
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const [success, setSuccess] = useState(false);
  const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(0);
  const [isLocked, setIsLocked] = useState(false);

  /** ---------------------------
   * Refs (critical for correctness)
   * --------------------------- */
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifyingRef = useRef(false);
  const verifiedOtpRef = useRef<string | null>(null);

  /** ---------------------------
   * Derived state
   * --------------------------- */
  const otp = useMemo(() => otpDigits.join(""), [otpDigits]);
  const isOtpComplete = otp.length === OTP_LENGTH;

  const otpRequestedRef = useRef(false);
  /** ---------------------------
   * Helper
   * --------------------------- */
  const resetOtp = useCallback(() => {
    verifiedOtpRef.current = null;
    verifyingRef.current = false;

    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setAutoFocusIndex(0);
  }, []);

  /** ---------------------------
   * Request OTP on first load
   * --------------------------- */
  useEffect(() => {
    if (checking) return;

    if (!sessionData.sessionId) return;

    if (otpRequestedRef.current) return;

    otpRequestedRef.current = true;

    requestOtp({ isAutomatic: true });
  }, [checking, sessionData.sessionId, requestOtp]);
  /** ---------------------------
   * Auto verify (single-fire, safe)
   * --------------------------- */
  useEffect(() => {
    if (
      !isOtpComplete ||
      loading ||
      success ||
      isLocked ||
      verifyingRef.current ||
      verifiedOtpRef.current === otp
    ) {
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      verifyingRef.current = true;
      verifiedOtpRef.current = otp;

      const result = await verifyOtp(otp);

      verifyingRef.current = false;

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handlePostAuthRedirect({
            router,
            // callbackUrl: searchParams.get("callbackUrl"),
            signupIntent,
            clearRegistrationSession: true,
          });
        }, 500);
        return;
      }

      // ---- Backend-authoritative handling ----
      if (result.status === 429) {
        // Max attempts exceeded OR resend cooldown
        setIsLocked(true);
        return;
      }

      // Allow retry for normal invalid OTP
      resetOtp();
    }, VERIFY_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    otp,
    isOtpComplete,
    loading,
    success,
    isLocked,
    verifyOtp,
    router,
    signupIntent,
  ]);

  /** ---------------------------
   * Cleanup on unmount
   * --------------------------- */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  /** ---------------------------
   * Autofocus management
   * --------------------------- */
  useEffect(() => {
    if (autoFocusIndex !== null) {
      inputRefs.current[autoFocusIndex]?.focus();
      setAutoFocusIndex(null);
    }
  }, [autoFocusIndex]);

  /** ---------------------------
   * Input handlers
   * --------------------------- */
  const handleChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").charAt(0) || "";

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      setAutoFocusIndex(index + 1);
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;

      setOtpDigits((prev) => {
        const next = [...prev];

        if (next[index]) {
          next[index] = "";
          setAutoFocusIndex(index);
        } else if (index > 0) {
          next[index - 1] = "";
          setAutoFocusIndex(index - 1);
        }

        return next;
      });
    },
    [],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text").replace(/\D/g, "");

      const next = Array(OTP_LENGTH).fill("");
      text
        .slice(0, OTP_LENGTH)
        .split("")
        .forEach((c, i) => (next[i] = c));

      setOtpDigits(next);
      setAutoFocusIndex(Math.min(text.length, OTP_LENGTH - 1));
    },
    [],
  );

  /** ---------------------------
   * Resend OTP (explicit only)
   * --------------------------- */
  const handleResend = useCallback(async () => {
    if (resendRunning || resendLoading || isLocked) return;

    const result = await requestOtp({ isAutomatic: false });

    if (!result.success) {
      if (result.status === 429) {
        switch (result.code) {
          case "WAIT_ANOTHER_OTP":
            startResendCountdown(result.retryAfter ?? RESEND_COOLDOWN);
            return;

          case "MAXIMUM_OTP_ATTEMPTS":
            setIsLocked(true);
            return;

          default:
            return;
        }
      }
    }

    clearOtp();
    resetOtp();
    setSuccess(false);
    setIsLocked(false);
    startResendCountdown(result.retryAfter ?? RESEND_COOLDOWN);
  }, [
    resendRunning,
    clearOtp,
    resetOtp,
    startResendCountdown,
    setSuccess,
    setIsLocked,
  ]);

  return {
    checking,
    otpDigits,
    success,
    loading,
    resendLoading,
    requestLoading,
    error,
    message,
    resendTimer,
    resendRunning,
    isLocked,
    isOtpComplete,

    inputRefs,

    handleChange,
    handleKeyDown,
    handlePaste,
    handleResend,
  };
}
