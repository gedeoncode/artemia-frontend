export abstract class BaseError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;
  public readonly cause?: unknown;

  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly data?: unknown;
  public readonly meta?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode?: number,
    options?: {
      cause?: unknown;
      isOperational?: boolean;
      code?: string;
      data?: unknown;
      meta?:Record<string, unknown>
    },
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = options?.code;
    this.data = options?.data;
    this.meta = options?.meta

    this.isOperational = options?.isOperational ?? true;
    this.cause = options?.cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  getUserMessage(): string {
    return this.message;
  }
}
