"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/domain/auth/services/registrationService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_MESSAGES, REGISTRATION_SESSION } from "@/constants/index";
import { logger } from "@/lib/logger";
import { validateEmail } from "@/lib/validators/email";
import { useRegistrationStepGuard } from "./useRegistrationGuard";
import { classify } from "@/errors/classify";

type RegistrationSession = {
  sessionId: string;
  email: string;
  attempts?: number;
  lastAttempt?: number;
};

type UseEmailRegistrationOptions = {
  onSuccess?: () => void;
};

export function useEmailRegistration(options?: UseEmailRegistrationOptions) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sessionData, setSessionData] = useLocalStorage<RegistrationSession>(
    REGISTRATION_SESSION,
    {
      sessionId: "",
      email: "",
    },
  );
  const { checking } = useRegistrationStepGuard(sessionData.sessionId, "EMAIL");

  const submitEmail = async () => {
    if (loading) return;
    setError("");

    const { valid } = validateEmail(email);
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await registrationService.start(email);

      if (!res?.success || !res.data?.sessionId) {
        throw new Error("Invalid server response");
      }

      const { sessionId } = res.data;

      // Persist full registration session state
      setSessionData({
        sessionId,
        email,
        attempts: 0,
        lastAttempt: undefined,
      });
      options?.onSuccess?.();

      router.push(`/auth/register/purpose?session=${sessionId}`);
    } catch (rawError: unknown) {
      const err = classify(rawError);

      const message =
        (err?.code &&
          AUTH_MESSAGES.registration.error[
            err.code as keyof typeof AUTH_MESSAGES.registration.error
          ]) ||
        AUTH_MESSAGES.baseError.error.SERVER_ERROR;
      logger.error("registration.start.failed", { email, message });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    checking,
    email,
    setEmail,
    loading,
    error,
    submitEmail,
    sessionData,
  };
}
