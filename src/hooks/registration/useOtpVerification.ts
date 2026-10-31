"use client";

import { useState } from "react";
import { registrationService } from "@/domain/auth/services/registrationService";
import { OTP_LENGTH, AUTH_MESSAGES } from "@/constants/index";
import { classify } from "@/errors/classify";
import { OtpResult } from "@/types/registrationType";

interface UseOtpVerificationOptions {
  sessionId: string;
}

export function useOtpVerification({ sessionId }: UseOtpVerificationOptions) {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // Shared
  const handleError = (rawError: unknown): OtpResult => {
    const err = classify(rawError);

    const message =
      (err.code &&
        AUTH_MESSAGES.registration.error[
          err.code as keyof typeof AUTH_MESSAGES.registration.error
        ]) ??
      AUTH_MESSAGES.baseError.error.SERVER_ERROR;

    setError(message);

    return {
      success: false,
      status: err.statusCode,
      code: err.code,
      // retryAfter: (err?.meta as { retryAfter: number }).retryAfter,
      message,
    };
  };
  /**
   * Verify OTP
   */
  const verifyOtp = async (otp: string): Promise<OtpResult> => {
    setError("");

    if (!sessionId) {
      return {
        success: false,
        message: AUTH_MESSAGES.registration.error.SESSION_MISSING,
      };
    }

    if (!otp || otp.length !== OTP_LENGTH) {
      const msg = "Please enter the complete OTP code.";
      setError(msg);
      return { success: false, message: msg };
    }

    try {
      setLoading(true);

      const res = await registrationService.verifyOtp(sessionId, otp);

      if (!res?.success) {
        return {
          success: false,
          message: res.message || "OTP verification failed.",
        };
      }
      return { success: true };
    } catch (err) {
      console.log("verify error:", err)
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request OTP
   */
  const requestOtp = async ({
    isAutomatic,
  }: {
    isAutomatic: boolean;
  }): Promise<OtpResult> => {
    setError("");
    setMessage("");

    if (!sessionId) {
      return {
        success: false,
        message: "Invalid registration session.",
      };
    }

    try {
      if (isAutomatic) {
        setRequestLoading(true);
      } else {
        setResendLoading(true);
      }

      const res = await registrationService.sendOtp(sessionId);

      if (!res?.success) {
        return {
          success: false,
          message: res?.message || "Failed to resend OTP.",
          retryAfter: res?.retryAfter,
        };
      }
      if (!isAutomatic) {
        setMessage(res.message || "A new OTP has been sent to your email.");
      }
      return { success: true };
    } catch (err) {
      console.log("Error:", err);

      return handleError(err);
    } finally {
      if (isAutomatic) {
        setRequestLoading(false);
      } else {
        setResendLoading(false);
      }
    }
  };

  return {
    loading,
    resendLoading,
    requestLoading,
    verifyOtp,
    requestOtp,
    error,
    message,
    clearOtp: () => {
      setError("");
      setMessage("");
    },
  };
}
