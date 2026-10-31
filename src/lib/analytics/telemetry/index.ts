export const trackMetric = (name: string, payload?: Record<string, any>) => {
  // Plug in Datadog / OpenTelemetry / Prometheus
  console.debug("[metric]", name, payload);
};

export const captureError = (err: unknown, ctx?: Record<string, any>) => {
  // Plug in Sentry / LogRocket / Datadog APM
  console.error("[error]", err, ctx);
};
