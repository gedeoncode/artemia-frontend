export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(
    message: string,
    opts?: { status?: number; code?: string; details?: any }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

export const isTransientError = (err: unknown) => {
  if (!err) return false;
  if (err instanceof ApiError) {
    return !!(err.status && err.status >= 500 && err.status < 600);
  }
  if (err instanceof TypeError) return true; // network failure
  const msg = (err as any)?.message ?? "";
  return /network|failed to fetch|timeout/i.test(msg);
};

export const isAuthError = (err: unknown) => {
  if (!err) return false;
  if (err instanceof ApiError) {
    return err.status === 401 || err.status === 403;
  }
  const msg = (err as any)?.message ?? "";
  return /unauthorized|forbidden|authentication/i.test(msg);
};

/*
USAGE EXAMPLE
try {
  await apiCall();
} catch (err) {
  if (isAuthError(err)) {
    // maybe redirect to login
  } else if (isTransientError(err)) {
    // maybe retry automatically
  }

  // always get something nice to display
  const msg = getErrorMessage(err);
  toast.error(msg);
}

*/
