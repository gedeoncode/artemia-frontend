import React from "react";
import {

  TransientError,
  BaseError
} from "@/errors/index";

interface ErrorsAlertProps {
  error: BaseError;
  onRetry?: () => void; // Optional retry callback
  messages?: Record<string, string>;
}

const errorMessages: Record<string, string> = {
  ValidationError: "Please check your input and try again.",
  NotFoundError: "The requested item could not be found.",
  UnauthorizedError: "You are not authorized to perform this action.",
  DomainError: "There was an issue with the data you provided.",
  TransientError: "Service is temporarily unavailable. Please try again.",
  InfrastructureError:
    "Network or unexpected error occurred. Please try again.",
};
export const ErrorsAlert: React.FC<ErrorsAlertProps> = ({
  error,
  onRetry,
  messages = errorMessages,
}) => {
    console.log("error status", error.statusCode);
  const userMessage =
    messages[error.constructor.name] || error.message || "An unknown error occurred";
  const isRetryable = error instanceof TransientError && onRetry;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col gap-2 p-4 text-red-800 bg-red-100 border border-red-300 rounded-md"
    >
      <span>
        <strong>Error:</strong> {userMessage}
      </span>

      {isRetryable && (
        <button
          onClick={onRetry}
          className="px-3 py-1 mt-2 font-semibold bg-red-200 rounded-md hover:bg-red-300"
        >
          Retry
        </button>
      )}
    </div>
  );
};
