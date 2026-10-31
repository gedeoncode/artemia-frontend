export function AuthAlert({
  message,
  countdown,
  formatDelay,
  onRetry,
}: {
  message: string;
  countdown?: number | null;
  formatDelay: (seconds: number) => string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`mb-4 rounded-md p-3 text-sm ${
        countdown ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-700"
      }`}
    >
      <p className="font-medium">{message}</p>

      {countdown ? (
        <p className="mt-1 text-sm">
          Veuillez patienter{" "}
          <span className="font-semibold">{formatDelay(countdown)}</span>
        </p>
      ) : onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          Réessayer maintenant
        </button>
      ) : null}
    </div>
  );
}