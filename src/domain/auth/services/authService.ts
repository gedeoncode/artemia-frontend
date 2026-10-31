import { UserProfileResponse } from "@/domain/auth/types";
import { apiFetch, FetchOptions } from "@/lib/fetchLayers/apiFetch";
import { authFetch } from "@/lib/fetchLayers/authFetch";
import {
  LoginResponse,
  LogoutResponse,
  ResolveRedirectResponse,

} from "@/types/user.types";

export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  LOGOUT: "/api/v1/auth/logout",
  PROFILE: "/api/v1/auth/me",
  RESOLVE_REDIRECT: "/api/v1/auth/resolve-redirect",
  REFRESH: "/api/v1/auth/refresh",
} as const;

export const authService = {
  login(email: string, password: string): Promise<LoginResponse> {
    return authFetch(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout(): Promise<LogoutResponse> {
    return apiFetch(AUTH_ENDPOINTS.LOGOUT, {
      method: "POST",
      requireAuth: true,
    });
  },

  profile(options?: FetchOptions): Promise<UserProfileResponse> {
    return apiFetch(AUTH_ENDPOINTS.PROFILE, {
      method: "GET",
      requireAuth: true,
      ...options,
    });
  },
  resolveRedirect(): Promise<ResolveRedirectResponse> {
    return apiFetch(AUTH_ENDPOINTS.RESOLVE_REDIRECT, {
      method: "GET",
      requireAuth: true,
    });
  },

  refresh(): Promise<LoginResponse> {
    return apiFetch(AUTH_ENDPOINTS.REFRESH, {
      method: "POST",
      requireAuth: true,
    });
  },
};
