// src/constants/routes.ts

export const ROUTES = {
  HOME: "/",

  AUTH: {
    LOGIN: "/auth/login",

    REGISTER: {
      EMAIL: "/auth/register/email",
      PURPOSE: "/auth/register/purpose",
      DETAILS: "/auth/register/details",
      VERIFY_OTP: "/auth/register/verify-otp",
    },
  },

  CHECKOUT: {
    ROOT: "/checkout",
    REVIEW: "/checkout/review",
    SUCCESS: "/checkout/success",
  },

  ORDERS: "/orders",
  BECOME_SELLER: "/sell-on-artemia",

  SELLER: {
    DASHBOARD: "/seller/dashboard",
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
  },
} as const;