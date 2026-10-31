import { getStoredAction } from "./storePreAuthAction";
import { validateRedirectPath } from "./validateRedirectPath";
import { getEntryPath } from "./entryPath";
import { SignupIntent } from '@/types/registrationType'

type ResolveRedirectParams = {
  callbackUrl?: string | null;
  signupIntent?: SignupIntent;
};

/**
 * Resolves post-auth redirect target.
 *
 * Priority:
 * 1. Explicit callback URL (sanitized)
 * 2. Stored pre-auth user intent
 */
export function resolvePostAuthRedirect({
  callbackUrl,
  signupIntent,
}: ResolveRedirectParams): string {
  if (callbackUrl) {
    return validateRedirectPath(callbackUrl);
  }

  const storedAction = getStoredAction();
  if (storedAction?.path) {
    return validateRedirectPath(storedAction.path);
  }
  return getEntryPath();
}
