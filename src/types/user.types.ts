import { CommissionModel } from "./category/category.types";

export interface LogoutResponse {
  success: boolean;
}
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SELLER = "seller",
  CLIENT = "client",
}
export enum UserIntent {
  BECOME_SELLER = "BECOME_SELLER",
  BROWSE = "BROWSE",
}
export interface LoginResponse {
  success: boolean;
  user: BaseUser;
}
export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  phone?: string;
  avatar?: string;
  userIntent?: UserIntent;
  onboardingStep?: string | null;
  commissionModel: CommissionModel;
  sellerType?: "individual" | "company";
  sellerId?: string;
}

export type ResolveRedirectResponse = {
  success: boolean;
  redirectTo?: string;
};
export interface UserSummary {
  id: string;
  name: string;

  email: string;

  phone?: string;
}
