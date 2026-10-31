// lib/server-registration.ts

import { apiFetch } from "@/lib/fetchLayers/apiFetch";
import { UserIntent } from "@/types";

import {
  RegistrationSession,
  StartRegistrationResponse,
  SetRoleResponse,
  PersonalInfoResponse,
  VerifyOtpResponse,
  OtpResult,
} from "@/types/registrationType";

export const registrationService = {
  start: async (
    email: string,
  ): Promise<ApiResponse<StartRegistrationResponse>> => {
    return await apiFetch("/api/v1/register/start", {
      method: "POST",
      body: { email },
    });
  },

  setUserIntent: async (
    sessionId: string,
    intent: UserIntent,
  ): Promise<ApiResponse<SetRoleResponse>> => {
    return await apiFetch("/api/v1/register/signup-intent", {
      method: "POST",
      body: { sessionId, intent },
    });
  },

  personalInfo: async (
    sessionId: string,
    payload: { name: string; phone: string; password: string },
  ): Promise<ApiResponse<PersonalInfoResponse>> => {
    return await apiFetch("/api/v1/register/personal-info", {
      method: "POST",
      body: { sessionId, personalInfo: payload },
    });
  },

  sendOtp: async (sessionId: string): Promise<OtpResult> => {
    return await apiFetch("/api/v1/register/send-otp", {
      method: "POST",
      body: { sessionId },
    });
  },

  verifyOtp: async (
    sessionId: string,
    otp: string,
  ): Promise<VerifyOtpResponse> => {
    return await apiFetch("/api/v1/register/verify-otp", {
      method: "POST",
      requireAuth: true,
      body: { sessionId, otp },
    });
  },
  getSession: async (
    sessionId: string,
  ): Promise<ApiResponse<RegistrationSession>> => {
    return await apiFetch(`/api/v1/register/session/${sessionId}`, {
      method: "GET",
    });
  },
};

/**
 * Generic API response type:
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
