// lib/auth/clearRegistrationSession.ts

import { REGISTRATION_SESSION } from "@/constants";

export function clearRegistrationSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(REGISTRATION_SESSION);
}