import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
  constructor(
    message: string,
    statusCode = 400,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: true });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    message: string,
    statusCode = 401,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: true });
  }
}

export class NotFoundError extends BaseError {
  constructor(
    message: string,
    statusCode = 404,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: true });
  }
}

export class DomainError extends BaseError {
  constructor(
    message: string,
    statusCode = 422,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: true });
  }
}

export class TransientError extends BaseError {
  constructor(
    message: string,
    statusCode = 503,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: true });
  }
}

export class InfrastructureError extends BaseError {
  constructor(
    message: string,
    statusCode = 500,
    options?: { cause?: unknown }
  ) {
    super(message, statusCode, { ...options, isOperational: false });
  }
}
