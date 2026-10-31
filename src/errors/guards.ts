// shared/errors/guards.ts

import { BaseError } from "./BaseError";

export function isUnauthorized(
  error: unknown,
): boolean {
  return (
    error instanceof BaseError &&
    error.statusCode === 401
  );
}

export function isNotFound(
  error: unknown,
): boolean {
  return (
    error instanceof BaseError &&
    error.statusCode === 404
  );
}