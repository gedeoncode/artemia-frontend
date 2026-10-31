"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserIntent, UserRole } from "@/types/user.types";
import { usePreauthIntent } from "./usePreauthIntent";
export const SIGNUP_INTENT_KEY = "signup_intent";

export function useBecomeSeller() {
  const router = useRouter();
  const { isAuthentificated, user } = useAuth();
  const { savePreauthIntent } = usePreauthIntent();
  return function becomeSeller() {
    // 1. Not authenticated → store intent + signup
    if (!isAuthentificated) {
      savePreauthIntent(UserIntent.BECOME_SELLER);
      router.push("/auth/register/email");
      return;
    }

    // Safety guard (should never happen, but enterprise-safe)
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // 2. Authenticated USER → onboarding
    if (user.role === UserRole.USER) {
      router.push("/onboarding");
      return;
    }

    // 3. SELLER → dashboard
    if (user.role === UserRole.SELLER) {
      router.push("/seller/dashboard");
      return;
    }
  };
}
