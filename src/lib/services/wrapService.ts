import {  InfrastructureError } from "../../errors/errorClasses";
import { classify } from "../../errors/classify";
import { BaseError } from "@/errors/BaseError";

export class ServiceError extends InfrastructureError {
  constructor(
    message: string,
    public service: string,
    public details?: any
  ) {
    // statusCode 0 for service-level frontend errors
    super(message, 0, { cause: details });
  }
}

/**
 * Wraps a service promise to standardize errors as ServiceError (InfrastructureError subclass)
 */
export async function wrapService<T>(
  promise: Promise<T>,
  service: string,
  message?: string
): Promise<T> {
  try {
    return await promise;
  } catch (err: any) {
    // Try to extract backend error message
    const backendMessage =
      err?.response?.data?.message ||
      err?.message ||
      message ||
      `Service failed: ${service}`;

    // Classify if it's already a BaseError, otherwise wrap in ServiceError
    const classifiedError =
      err instanceof BaseError
        ? err
        : new ServiceError(backendMessage, service, err?.response?.data);

    throw classify(classifiedError);
  }
}
