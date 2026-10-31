import { SessionUser } from "@/domain/auth/types";

const ROLES = {
  USER: "user", // default / neutral role
  SELLER: "seller",
  ADMIN: "admin",
};

const SIGNUP_INTENTS = {
  BECOME_SELLER: "BECOME_SELLER",
  BROWSE: "BROWSE",
};

const ROUTES = {
  LOGIN: "/auth/login",
  BROWSE: "/",
  HOME: "/",
  ONBOARDING: "/onboarding",

  USER_DASHBOARD: "/user/dashboard",

  SELLER_DASHBOARD: "/seller/dashboard",

  ADMIN_DASHBOARD: "/admin/",
};

type User = {
  role: typeof ROLES[keyof typeof ROLES];
  signupIntent?: typeof SIGNUP_INTENTS[keyof typeof SIGNUP_INTENTS];
  onboardingCompleted?: boolean;
};

export function getNextRedirect(user: SessionUser | null): string {
  if (!user) {
    return ROUTES.LOGIN;
  }

  const {
    role,
    signupIntent,
    onboardingCompleted,
  } = user;

  // 1️⃣ Admins always go to admin dashboard
  if (role === ROLES.ADMIN) {
    return ROUTES.ADMIN_DASHBOARD;
  }

  // 2️⃣ Sellers are resolved entirely by onboarding status
  if (role === ROLES.SELLER) {
    return onboardingCompleted
      ? ROUTES.SELLER_DASHBOARD
      : ROUTES.ONBOARDING;
  }

  // 3️⃣ Regular users (intent-driven)
  if (role === ROLES.USER) {
    switch (signupIntent) {
      case SIGNUP_INTENTS.BECOME_SELLER:
        return ROUTES.ONBOARDING;

      case SIGNUP_INTENTS.BROWSE:
      case undefined:
        return ROUTES.HOME;

      default:
        // Exhaustive safety net
        return ROUTES.HOME;
    }
  }

  // 4️⃣ Fallback for impossible states
  return ROUTES.LOGIN;
}
