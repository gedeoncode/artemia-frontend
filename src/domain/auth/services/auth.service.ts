"use server"
import { serverFetch } from "@/lib/http";
import { UserProfileResponse } from "../types";

export async function getCurrentUser() {
  return serverFetch<UserProfileResponse>("/api/v1/auth/me",
    {
      method: "GET",
    }
  );
}
