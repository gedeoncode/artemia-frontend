// ValidationBadge.tsx
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

interface ValidationBadgeProps {
  status: "valid" | "warning" | "error";
  issues: string[];
  warnings: string[];
}

export function ValidationBadge({ status, issues, warnings }: ValidationBadgeProps) {
  const config = {
    valid: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      text: "text-green-700",
      label: "Ready to publish"
    },
    warning: {
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      text: "text-amber-700",
      label: "Needs review"
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      text: "text-red-700",
      label: "Requires fixes"
    }
  }[status];

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <div className="text-sm">
        <span className={`font-medium ${config.text}`}>{config.label}</span>
        <div className="text-xs opacity-80">
          {status === "error" && `${issues.length} issue${issues.length !== 1 ? 's' : ''}`}
          {status === "warning" && `${warnings.length} recommendation${warnings.length !== 1 ? 's' : ''}`}
          {status === "valid" && "All checks passed"}
        </div>
      </div>
    </div>
  );
}
