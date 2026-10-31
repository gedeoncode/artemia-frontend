import { UserIntent } from "./user.types";

export type UserRole = "user" | "seller";

export type RegistrationStep =
  | "EMAIL"
  | "SIGNUP_INTENT"
  | "PERSONAL_INFO"
  | "OTP"
  | "COMPLETED";

/**
 * Frontend-safe registration session state
 */
export interface RegistrationSession {
  sessionId: string;
  email: string;
  currentStep: RegistrationStep;
  role?: UserRole; // role is not known until ROLE step
  intent?: UserIntent;
  isCompleted: boolean;
}

/**
 * Generic response for step transitions
 */
export interface StepResponse<TStep extends RegistrationStep> {
  sessionId: string;
  nextStep: TStep;
}

/**
 * API Responses
 */
export type StartRegistrationResponse = StepResponse<"SIGNUP_INTENT">;

export type SetRoleResponse = StepResponse<"PERSONAL_INFO">;

export type PersonalInfoResponse = StepResponse<"OTP">;

export type OtpResult =
  | {
      success: true;
      message?: string;
      retryAfter?: number;
    }
  | {
      success: false;
      status?: number;
      code?: string;
      message?: string;
      retryAfter?: number;
    };

/**
 * OTP verification success response
 */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}
