// /errors/toPresentation.ts

import { BaseError } from "./BaseError";
import { ErrorPresentation } from "./types";

export function toPresentation(
  error: BaseError,
): ErrorPresentation {
  switch (error.constructor.name) {
    case "TransientError":
      return {
        title: "Temporary Issue",
        description:
          "The service is temporarily unavailable.",
        actionLabel: "Try Again",
        canRetry: true,
      };

    case "InfrastructureError":
      return {
        title: "Something Went Wrong",
        description:
          "An unexpected error occurred.",
        actionLabel: "Retry",
        canRetry: true,
      };

    default:
      return {
        title: "Error",
        description: error.message,
        canRetry: false,
      };
  }
}