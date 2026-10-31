"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/domain/auth/services/authService";
import { clearStoredAction } from "@/lib/utils/navigation/storePreAuthAction";
import { handlePostAuthRedirect } from "@/lib/utils/navigation/handlePostAuthRedirect";
import { validateEmail } from "@/lib/validators/email";
import { logger } from "@/lib/logger";
import { classify } from "@/errors/classify";
import { AUTH_MESSAGES } from "@/constants/index";
import { TransientError } from "@/errors/errorClasses";

/* --------------------------------------------
 * Types
 * ------------------------------------------ */

export type UseLoginOptions = {
  onSuccess?: () => void;
};

export type LoginErrorKey = keyof typeof AUTH_MESSAGES.login.error;

export type LoginErrors = {
  inline?: {
    email?: string;
    password?: string;
  };
  banner?: string;
};

/* --------------------------------------------
 * Hook
 * ------------------------------------------ */

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* --------------------------------------------
   * State
   * ------------------------------------------ */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [countdown, setCountdown] = useState<number | null>(null);

  /* --------------------------------------------
   * Refs
   * ------------------------------------------ */

  const loadingRef = useRef(false);
  const countdownRef = useRef<number | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  /* --------------------------------------------
   * Effects
   * ------------------------------------------ */

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    countdownRef.current = countdown;
    if (countdown === 0) {
      setCountdown(null);
      setErrors({});
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    }
  }, [countdown]);

  /* --------------------------------------------
   * Helpers
   * ------------------------------------------ */

  const formatDelay = useCallback((seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m${secs ? ` ${secs}s` : ""}`;
    }
    return `${seconds}s`;
  }, []);

  const startCountdown = useCallback((seconds: number) => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
    setCountdown(seconds);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
  }, []);

  const redactEmail = (value: string) => {
    const [user, domain] = value.split("@");
    if (!user || !domain) return "***";
    return `${user[0]}***@${domain}`;
  };

  /* --------------------------------------------
   * Submit
   * ------------------------------------------ */

  const submitLogin = useCallback(async () => {
    if (loadingRef.current || countdownRef.current) return;

    setErrors({});

    // Client-side validation
    if (!email || !password) {
      setErrors({
        inline: {
          email: !email
            ? AUTH_MESSAGES.login.error.CREDENTIALS_MISSING
            : undefined,
          password: !password
            ? AUTH_MESSAGES.login.error.CREDENTIALS_MISSING
            : undefined,
        },
      });
      return;
    }

    if (!validateEmail(email).valid) {
      setErrors({ inline: { email: AUTH_MESSAGES.login.error.INVALID_EMAIL } });
      return;
    }

    loadingRef.current = true;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await authService.login(email, password);

      if (!res?.user) {
        throw classify({
          status: 500,
          code: "INVALID_RESPONSE",
          message: "Invalid server response",
          data: res,
        });
      }

      options?.onSuccess?.();
      handlePostAuthRedirect({
        router,
        callbackUrl: searchParams.get("callbackUrl"),
      });
    } catch (rawError) {
      if (!mountedRef.current) return;

      const err = classify(rawError);
      console.log("Data", err.data);
      if (
        err instanceof TransientError &&
        err.statusCode === 429 &&
        err.data?.nextAttempt
      ) {
        const seconds = Math.max(
          0,
          Math.ceil(
            (new Date(err.data.nextAttempt).getTime() - Date.now()) / 1000,
          ),
        );

        startCountdown(seconds);

        setErrors({
          banner:
            err.data.error ??
            AUTH_MESSAGES.login.error.MAX_ATTEMPTS ??
            "Too many attempts. Please try again later.",
        });

        logger.warn("auth.login.rate_limited", {
          email: redactEmail(email),
        });

        return;
      }

      const mappedMessage =
        err.code &&
        (AUTH_MESSAGES.login.error as Record<string, string>)[
          err.code as LoginErrorKey
        ];

      setErrors({
        banner: mappedMessage ?? AUTH_MESSAGES.baseError.error.SERVER_ERROR,
      });

      logger.error("auth.login.failed", {
        email: redactEmail(email),
        status: err.statusCode,
        code: err.code,
      });
    } finally {
      if (mountedRef.current) {
        loadingRef.current = false;
      }
      clearStoredAction();
    }
  }, [email, password, router, searchParams, options, startCountdown]);
  const loading = loadingRef.current;
  /* --------------------------------------------
   * Public API
   * ------------------------------------------ */

  return {
    email,
    password,
    showPassword,
    errors,
    countdown,
    emailRef,
    loading,

    setEmail,
    setPassword,
    setShowPassword,
    setErrors,

    formatDelay,
    submitLogin,
  };
}
