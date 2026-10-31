// src/lib/auth/cookie.ts
"use server";
import { cookies } from "next/headers";

export async function getCookieValue(key: string): Promise<string | undefined> {
  return (await cookies()).get(key)?.value;
}
