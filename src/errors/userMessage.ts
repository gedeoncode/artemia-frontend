// errors/getUserFacingMessage.ts

import { BaseError } from "./BaseError";

export function getUserFacingMessage(
  error: unknown,
): string {
  if (error instanceof BaseError) {
    return error.getUserMessage();
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}