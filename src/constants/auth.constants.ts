export const REGISTRATION_SESSION = "registration_session";
export const REGISTRATION_ROLE = "registration_role";
export const RESEND_COOLDOWN = 60;
export const OTP_LENGTH = 6;
export const VERIFY_DEBOUNCE_MS = 300;
export const MAX_ATTEMPTS = 3;
export const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

// registration messages
export const AUTH_MESSAGES = {
  baseError: {
    error: {
      SERVER_ERROR: "Something went wrong. Please try again.",
    },
  },

  login: {
    success: {
      LOGIN_SUCCESS: "Login successful",
    },
    error: {
      CREDENTIALS_MISSING: "Email and password are required",
      INVALID_CREDENTIALS: "Invalid email or password",
      INVALID_PASSWORD: "Invalid password",
      INVALID_EMAIL: "Please enter a valid email address.",
      EMAIL_NOT_VERIFIED: "Please verify your email",
      SELLER_NOT_VALID:
        "Your seller account is not valid. Please complete verification.",
      MAX_ATTEMPTS: "Too many requests, please try again later...",
    },
  },

  registration: {
    success: {
      EMAIL_SENT: "E-mail de vérification envoyé",
      INTENT_SELECTED: "Votre choix a bien été enregistré",
      PERSONAL_INFO_SAVED:
        "Vos informations personnelles ont été enregistrées avec succès",
      OTP_SENT: "Un code de vérification a été envoyé à votre adresse e-mail",
      OTP_VERIFIED:
        "Code vérifié avec succès. Votre compte est maintenant activé",
    },
    error: {
      SESSION_MISSING:
        "We couldn’t find your registration session. Please start the registration again.",
      SESSION_EXPIRED:
        "Your registration session has expired. Please start again.",

      INVALID_EMAIL: "Please enter a valid email address.",
      REGISTRATION_EMAIL_EXISTS: "An account with this email already exists.",

      ROLE_MISSING: "Missing registration session. Please restart.",
      ROLE_SAVE_FAILED: "Failed to save role. Try again.",

      REGISTRATION_COMPLETED:
        "Your registration is already complete. You don’t need to make any changes.",
      INVALID_STEP:
        "Please complete the previous step before selecting your role.",

      PERSONAL_INFO_MISSING:
        "Please fill out all required personal information.",
      PHONE_INVALID: "Please enter a valid phone number.",
      PHONE_ALREADY_REGISTERED: "This phone number is already registered.",

      OTP_SEND_FAILED: "Failed to send OTP. Please try again.",
      INVALID_SESSION: "Invalid or missing session ID. Please start again.",
      CANNOT_SEND_OTP: "You cannot request an OTP at this stage.",
      WAIT_ANOTHER_OTP: "Please wait a moment before requesting another OTP.",

      OTP_NOT_ALLOWED: "OTP verification is not allowed at this stage.",
      MAXIMUM_OTP_ATTEMPTS:
        "You have exceeded the maximum number of OTP attempts. Please restart registration.",
      INVALID_OTP: "The OTP you entered is invalid. Please try again.",
      REGISTRATION_FAILED:
        "Registration failed due to a server error. Please try again.",
    },
  },
} as const;

export type AuthSection = keyof typeof AUTH_MESSAGES;
export type AuthFlow<T extends AuthSection> = keyof (typeof AUTH_MESSAGES)[T];
export type AuthMessageKey<
  T extends AuthSection,
  F extends AuthFlow<T>,
> = keyof (typeof AUTH_MESSAGES)[T][F];
