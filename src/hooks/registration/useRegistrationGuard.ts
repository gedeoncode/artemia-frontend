"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registrationService } from "@/domain/auth/services/registrationService";
import { RegistrationStep } from "@/types/registrationType";
import { handlePostAuthRedirect } from "@/lib/utils/navigation/handlePostAuthRedirect";
import { usePreauthIntent } from "./usePreauthIntent";
import { UserIntent } from "@/types";
import { classify } from "@/errors";
import { clearRegistrationSession } from "@/domain/auth/lib/clearRegistrationSession";

interface UseRegistrationStepGuardResult {
  checking: boolean;
  signupIntent?: UserIntent;
}

export function useRegistrationStepGuard(
  sessionId: string | null | undefined,
  expectedStep: RegistrationStep,
): UseRegistrationStepGuardResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next_url")
  const [checking, setChecking] = useState(true);
  const [signupIntent, setSignupIntent] = useState<UserIntent | undefined>(
    undefined,
  );

  const { preauthIntent } = usePreauthIntent();

  useEffect(() => {
    let active = true;

    const redirect = (path: string) => {
      if (active) router.replace(path);
    };

    const checkStep = async () => {
      console.log("session:", sessionId);
      if (!sessionId) {
        redirect("/auth/register/email");
        if (active) setChecking(false);
        return;
      }

      try {
        const { data } = await registrationService.getSession(sessionId);

        if (!active) return;

        // Determine effective signup intent
        // 1. Use backend session if available (authoritative)
        // 2. Fallback to pre-auth sessionStorage intent

        const effectiveIntent: UserIntent | undefined =
          data.intent || preauthIntent || undefined;
        setSignupIntent(effectiveIntent);

        // Redirect if currentStep doesn't match expected
        if (data.currentStep !== expectedStep) {
          switch (data.currentStep as RegistrationStep) {
            case "COMPLETED":
              handlePostAuthRedirect({
                router,
                callbackUrl: nextUrl,
                signupIntent: effectiveIntent,
                clearRegistrationSession: false,
              });
              break;
            case "PERSONAL_INFO":
              redirect("/auth/register/details");
              break;
            case "EMAIL":
              redirect("/auth/register/email");
              break;
            case "SIGNUP_INTENT":
              redirect("/auth/register/purpose");
              break;
            case "OTP":
              redirect("/auth/register/verify-otp");
              break;
            default:
              redirect("/auth/register/email");
          }
        }
      } catch (err: unknown) {
        const error = classify(err);
        if (error.code === "INVALID_SESSION") {
          clearRegistrationSession();
          redirect("/auth/register/email");
          return;
        }
        redirect("/auth/register/email");
      } finally {
        if (active) setChecking(false);
      }
    };

    checkStep();

    return () => {
      active = false;
    };
  }, [sessionId, expectedStep, router, nextUrl, preauthIntent]);

  return { checking, signupIntent };
}
