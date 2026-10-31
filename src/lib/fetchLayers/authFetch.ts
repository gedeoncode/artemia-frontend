import { classify } from "../../errors";
import { API_BASE_URL } from "@/config/env";

export async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  const isFormData = options.body instanceof FormData;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",

      headers: {
        ...options.headers,
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                (options.headers as Record<string, string>)?.["Content-Type"] ??
                "application/json",
            }),
      },
    });
  } catch (err) {
    // Network / CORS / offline
    throw classify({
      status: 0,
      message: (err as Error).message,
      code: "NETWORK_ERROR",
      cause: err,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  let data: unknown;

  try {
    data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch (err) {
    throw classify({
      status: response.status,
      message: "Failed to parse response body",
      code: "PARSE_ERROR",
      cause: err,
    });
  }

  if (!response.ok) {
    throw classify({
      status: response.status,
      ...(typeof data === "object" && data !== null ? data : {}),
      message:
        (data as any)?.message ??
        (data as any)?.error ??
        `Request failed with status ${response.status}`,
    });
  }

  return data as T;
}
