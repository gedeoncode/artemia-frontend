"use client";

import { memo, useEffect, useState } from "react";
import { MetricAlert } from "./MetricAlert";
import type { Alert } from "../../types/dashboard.types";

type DashboardAlertsProps = {
  alerts: Alert[];
  onNavigate: (path: string) => void;
};

export const DashboardAlerts = memo(function DashboardAlerts({
  alerts,
  onNavigate,
}: DashboardAlertsProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  // Show new alerts one at a time with proper timing
  useEffect(() => {
    if (alerts.length === 0) return;

    const newAlerts = alerts.filter(
      (alert) => !visibleAlerts.some((visible) => visible.id === alert.id),
    );

    if (newAlerts.length > 0) {
      setVisibleAlerts((prev) => [...prev, ...newAlerts]);

      // Auto-dismiss alerts after 8 seconds
      const timers = newAlerts.map((alert) =>
        setTimeout(() => {
          setVisibleAlerts((prev) => prev.filter((a) => a.id !== alert.id));
        }, 8000),
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [alerts, visibleAlerts]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-3"
      role="region"
      aria-label="Notifications"
    >
      {visibleAlerts.map((alert) => (
        <MetricAlert
          key={alert.id}
          alert={alert}
          onClose={() =>
            setVisibleAlerts((prev) => prev.filter((a) => a.id !== alert.id))
          }
        />
      ))}
    </div>
  );
});
