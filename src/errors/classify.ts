import { metadata } from "@/app/layout";
import { BaseError } from "./BaseError";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  DomainError,
  TransientError,
  InfrastructureError,
} from "./errorClasses";

interface BackendErrorPayload {
  status?: number;
  message?: string;
  error?: string;
  code?: string;
  meta?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Maps any unknown value (backend response, JS error, or other)
 * into a BaseError subclass for consistent frontend handling
 */
export function classify(error: unknown): BaseError {
  if (error instanceof BaseError) return error;

  if (typeof error === "object" && error !== null && "status" in error) {
    const payload = error as BackendErrorPayload;

    const status = payload.status ?? 500;
    const message = payload.message ?? payload.error ?? "Unknown error";

    const baseOptions = {
      cause: payload, // raw backend response
      code: payload.code, // domain/app error code
      data: payload, // 👈 structured backend payload
      metadata: payload.meta,
    };

    if (status === 400)
      return new ValidationError(message, status, baseOptions);

    if (status === 401)
      return new UnauthorizedError(message, status, baseOptions);

    if (status === 404) return new NotFoundError(message, status, baseOptions);

    if (status === 422) return new DomainError(message, status, baseOptions);
    if (status === 409) return new DomainError(message, status, baseOptions);

    // 429 – rate limiting (retryAfter, nextAttempt live here)
    if (status === 429) return new TransientError(message, status, baseOptions);

    if (status === 503) return new TransientError(message, status, baseOptions);

    if (status >= 500)
      return new InfrastructureError(message, status, baseOptions);

    return new InfrastructureError(message, status, baseOptions);
  }

  if (error instanceof Error) {
    return new InfrastructureError(error.message, 0, {
      cause: error,
    });
  }

  return new InfrastructureError("Unknown frontend failure", 0, {
    cause: error,
  });
}
