// lib/logger.ts
export interface LogEntry {
  level: "error" | "warn" | "info" | "debug";
  message: string;
  context?: any;
  timestamp: Date;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  error(message: string, context?: any) {
    this.log("error", message, context);
  }

  warn(message: string, context?: any) {
    this.log("warn", message, context);
  }

  info(message: string, context?: any) {
    this.log("info", message, context);
  }

  debug(message: string, context?: any) {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  private log(level: LogEntry["level"], message: string, context?: any) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
    };

    // Console output
    const consoleMethod = console[level] || console.log;
    const prefix = `[${level.toUpperCase()}]`;

    if (context) {
      consoleMethod(prefix, message, context);
    } else {
      consoleMethod(prefix, message);
    }

    // TODO: Send to logging service in production
    this.sendToService(entry);
  }

  private sendToService(entry: LogEntry) {
    if (this.isDevelopment) return;

    // Example: Send to your logging service
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // }).catch(() => {
    //   // Silent fail for logging errors
    // });
  }
}

export function sendTelemetry(event: string, payload?: Record<string, unknown>) {
  try {
    // If your app exposes a telemetry client, use it:
    // window.__APP_TELEMETRY__?.track?.(event, payload);
    // Fallback to console.debug during dev
    console.debug("[telemetry]", event, payload);
  } catch {
    // swallow telemetry failures intentionally - shouldn't block UX
  }
}
export function reportError(context: string, err: unknown) {
  // In production, replace with Sentry/Datadog/etc.
  logger.error(`[${context}]`, err);
}

export const logger = new Logger();
