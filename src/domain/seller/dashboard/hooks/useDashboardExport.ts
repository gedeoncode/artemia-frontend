import { useState, useCallback } from "react";
import type { DashboardResponse } from "../types/";

export function useDashboardExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async (data: DashboardResponse | null) => {
    if (!data) return;

    setIsExporting(true);

    try {
      const exportPayload = {
        stats: data.stats,
        performance: data.performance,
        charts: data.charts,
        period: data.metadata.period,
        exportedAt: new Date().toISOString(),
      };

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      // Could integrate with a toast notification system here
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportData, isExporting };
}
