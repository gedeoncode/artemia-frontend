import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clearStoredAction } from "./storePreAuthAction";
import { REGISTRATION_SESSION } from "@/constants/auth.constants";
import { resolvePostAuthRedirect } from "./resolvePostAuthRedirect";
import { UserIntent } from "@/types";
import { clearRegistrationSession as clearSession } from "@/domain/auth/lib/clearRegistrationSession";

type HandleRedirectParams = {
  router: AppRouterInstance;
  callbackUrl?: string | null;
  signupIntent?: UserIntent;
  clearRegistrationSession?: boolean;
};

export function handlePostAuthRedirect({
  router,
  callbackUrl,
  signupIntent,
  clearRegistrationSession = false,
}: HandleRedirectParams) {
  if (clearRegistrationSession) {
    clearSession();
  }

  const target = resolvePostAuthRedirect({ callbackUrl, signupIntent });

  // Intent has been consumed — clear it
  clearStoredAction();

  router.push(target);
}
