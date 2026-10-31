import { API_BASE_URL } from "@/config/env";

export async function staticFetch<T = any>(
  endpoint: string,
  options: { signal?: AbortSignal } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    signal: options.signal,
  });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  return res.json();
}
