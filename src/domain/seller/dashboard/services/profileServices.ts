import { apiFetch } from "@/lib/fetchLayers/apiFetch";
import type {
  SellerInfo,
  ProfileUpdateParams,
  PasswordChangeParams,
} from "@/types/seller";
import { CommissionModel } from "@/types/category/category.types";
type UpdateSellingModeResponse = {
  success: boolean;
  message: string;
  seller?: { id: string; commissionModel: string };
};

export const fetchSellerProfile = async (props?: {
  token?: string;
  options?: RequestInit;
}): Promise<SellerInfo> => {
  const { token, options } = props ?? {};

  const safeOptions = {
    ...(options ?? {}),
    signal: options?.signal ?? undefined,
  };
  return apiFetch<SellerInfo>("/api/seller/profile", {
    method: "GET",
    requireAuth: true,
    token,
    ...safeOptions,
  });
};

export const updateSellerProfile = async (
  data: ProfileUpdateParams,
  token?: string,
): Promise<SellerInfo> =>
  apiFetch<SellerInfo>("/api/seller/profile", {
    method: "PATCH",
    requireAuth: true,
    body: data as unknown as BodyInit,
    token,
  });

export const changePassword = async (
  data: PasswordChangeParams,
  token?: string,
): Promise<void> =>
  apiFetch<void>("/api/v1/user/change-password", {
    method: "PATCH",
    requireAuth: true,
    body: data as unknown as BodyInit,
    token,
  });
export const updateSellingMode = async (
  mode: CommissionModel,
  token?: string,
): Promise<UpdateSellingModeResponse> =>
  apiFetch<UpdateSellingModeResponse>(
    "/api/seller/profile/change-selling-mode",
    {
      method: "PATCH",
      requireAuth: true,
      body: mode as unknown as BodyInit,
      token,
    },
  );

export const uploadDocument = async (
  file: File,
  documentType: string,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("documentType", documentType);

  return apiFetch<{ url: string }>("/api/seller/upload-document", {
    method: "POST",
    requireAuth: true,
    body: formData,
  });
};

export const uploadAvatar = async (
  file: File,
  token?: string,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("avatar", file);
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return apiFetch<{ url: string }>("/api/v1/user/avatar", {
    method: "POST",
    requireAuth: true,
    body: formData,
    token,
    timeout: 15000, // 15s for potentially large uploads
    retries: 2, // retry twice on transient errors
    retryDelay: 500, // base retry delay
  });
};
