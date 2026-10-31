"use server";
import { getCookieValue } from "./cookie";

export async function requireActionToken() {
  const token = await getCookieValue("access_token");
  if (!token) throw new Error("Missing access token");
  return token;
}
