"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/domain/auth/services/registrationService";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_MESSAGES, REGISTRATION_SESSION } from "@/constants/index";
import { useRegistrationStepGuard } from "./useRegistrationGuard";
import { classify } from "@/errors/classify";

interface FormState {
  name: string;
  phone: string;
  password: string;
}

type RegistrationSession = {
  sessionId: string;
  email: string;
};
type UseRegistrationDetailsOptions = {
  onSuccess? : ()=> void
}
export function useRegistrationDetails(options?: UseRegistrationDetailsOptions) {
  const router = useRouter();

  // Unified registration session
  const [sessionData] = useLocalStorage<RegistrationSession>(
    REGISTRATION_SESSION,
    {
      sessionId: "",
      email: "",
    },
  );

  const { sessionId } = sessionData;
  const { checking } = useRegistrationStepGuard(sessionId, "PERSONAL_INFO");

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Guard: missing session
  useEffect(() => {
    if (!sessionId) {
      setError("Missing registration session. Please restart.");
    }
  }, [sessionId]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const { name, phone, password } = form;

    if (!name || !phone || !password) {
      setError("All fields are required.");
      return;
    }

    if (!sessionId) {
      setError("No active session found.");
      return;
    }

    setLoading(true);

    try {
      const res = await registrationService.personalInfo(sessionId, {
        name,
        phone,
        password,
      });

      if (!res?.success) {
        throw new Error("Unexpected server response.");
      }
      options?.success?.()
      router.push("/auth/register/verify-otp");
    } catch (rawError: unknown) {
      const err = classify(rawError);
      const message =
        (err.code &&
          AUTH_MESSAGES.registration.error[
            err.code as keyof typeof AUTH_MESSAGES.registration.error
          ]) ||
        AUTH_MESSAGES.registration.error.REGISTRATION_FAILED;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    checking,
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
}
