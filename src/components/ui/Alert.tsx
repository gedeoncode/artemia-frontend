
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Circle,
  X,
} from "lucide-react";

interface AlertProps {
  variant?: "success" | "info" | "warning" | "default" | "destructive";
  title?: string;
  description?: string;
  dismissible?: boolean;
  autoDismiss?: boolean;
  autoDismissTime?: number; // milliseconds
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold">{children}</p>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm opacity-90">{children}</p>;
}
export function Alert({
  variant = "info",
  title,
  description,
  dismissible = true,
  autoDismiss = false,
  autoDismissTime = 5000, 
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  const styles = {
    success: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    info: { bg: "bg-blue-100", text: "text-blue-700", icon: Info },
    warning: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertTriangle },
    default: { bg: "bg-gray-100", text: "text-gray-700", icon: Circle },
    destructive: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  };

  const Icon = styles[variant].icon;

  // Auto-dismiss effect
  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => setVisible(false), autoDismissTime);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissTime]);

  if (!visible) return null;

  return (
    <div
      className={`rounded-md p-4 flex items-start justify-between transition-all duration-300 ease-in-out ${styles[variant].bg} ${styles[variant].text}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
        </div>
      </div>

      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="inline-flex p-1 ml-4 transition rounded-md hover:bg-black/10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// usage example

// import Alert from "@/components/Alert";
// export default function ExamplePage() {
//   return (
//     <div className="p-6 space-y-4">
//       {/* Regular persistent alert */}
//       <Alert
//         type="success"
//         title="Profile Updated"
//         description="Your profile has been successfully saved."
//       />

//       {/* Auto-dismiss after 3 seconds */}
//       <Alert
//         type="info"
//         title="Welcome Back"
//         description="You have new notifications."
//         autoDismiss
//         autoDismissTime={3000}
//       />

//       {/* Non-dismissible error */}
//       <Alert
//         type="destructive"
//         title="Critical Error"
//         description="Please contact support."
//         dismissible={false}
//       />
//     </div>
//   );
// }
