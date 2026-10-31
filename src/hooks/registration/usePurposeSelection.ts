"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/domain/auth/services/registrationService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { REGISTRATION_SESSION, AUTH_MESSAGES } from "@/constants/index";
import { useRegistrationStepGuard } from "./useRegistrationGuard";
import { classify } from "@/errors/classify";
import { usePreauthIntent } from "./usePreauthIntent";
import { UserIntent } from "@/types";

type RegistrationSession = {
  sessionId: string;
  email: string;
  intent?: UserIntent;
};
type UsePuroseSelectionOptions = {
  onSuccess?: () => void;
};
export function usePurposeSelection(options?: UsePuroseSelectionOptions) {
  const router = useRouter();

  const [sessionData, setSessionData] = useLocalStorage<RegistrationSession>(
    REGISTRATION_SESSION,
    {
      sessionId: "",
      email: "",
    },
  );

  const { checking, signupIntent: backendIntent } = useRegistrationStepGuard(
    sessionData.sessionId,
    "SIGNUP_INTENT",
  );

  const { preauthIntent, clearPreauthIntent } = usePreauthIntent();
  const { sessionId } = sessionData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | undefined>(
    undefined,
  );
  // Pre-fill the intent: backend authoritative, fallback to sessionStorage
  useEffect(() => {
    if (backendIntent) {
      setSelectedIntent(backendIntent);
    } else {
      if (preauthIntent) setSelectedIntent(preauthIntent);
    }
  }, [backendIntent, preauthIntent]);

  const chooseIntent = async (intent: UserIntent) => {
    if (!sessionId) {
      setError(AUTH_MESSAGES.registration.error.SESSION_MISSING);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await registrationService.setUserIntent(sessionId, intent);

      if (!res?.success || !res?.data?.nextStep) {
        throw new Error("Unexpected server response");
      }

      // Persist authoritative intent in registration session
      setSessionData((prev) => ({
        ...prev,
        intent,
      }));

      // Clear pre-auth sessionStorage intent — no longer needed
      clearPreauthIntent();
      options?.onSuccess?.()
      router.push("/auth/register/details");
    } catch (rawError: unknown) {
      const err = classify(rawError);
      const message =
        (err.code &&
          AUTH_MESSAGES.registration.error[
            err.code as keyof typeof AUTH_MESSAGES.registration.error
          ]) ||
        AUTH_MESSAGES.baseError.error.SERVER_ERROR;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    checking,
    sessionId,
    loading,
    error,
    selectedIntent, // use this to pre-fill UI
    chooseIntent,
  };
}
