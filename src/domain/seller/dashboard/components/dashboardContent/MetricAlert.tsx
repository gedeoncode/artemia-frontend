// components/MetricAlert.tsx
import { useEffect, useState } from "react";
import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type AlertType = 'success' | 'warning' | 'error' | 'info';
export type AlertPriority = 'low' | 'medium' | 'high';

export interface MetricAlertProps {
  alert: {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    priority: AlertPriority;
    timestamp: Date;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const alertIcons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />
};

const alertColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    button: 'hover:bg-green-100'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    button: 'hover:bg-yellow-100'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    button: 'hover:bg-red-100'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    button: 'hover:bg-blue-100'
  }
};

const priorityStyles = {
  low: 'border-l-4',
  medium: 'border-l-8',
  high: 'border-l-12 shadow-lg ring-2 ring-opacity-50'
};

export function MetricAlert({ 
  alert, 
  onClose, 
  autoClose = true, 
  autoCloseDelay = 5000 
}: MetricAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const colors = alertColors[alert.type];
  const Icon = alertIcons[alert.type];

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (autoClose && alert.priority !== 'high') {
      const timer = setTimeout(handleClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, alert.priority]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        ${colors.bg} 
        ${colors.border} 
        ${priorityStyles[alert.priority]}
        border rounded-lg shadow-lg 
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          {Icon}
        </div>
        
        <div className="flex-1 ml-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${colors.text}`}>
              {alert.title}
            </h3>
            <span className="ml-2 text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className={`mt-1 text-sm ${colors.text}`}>
            {alert.message}
          </div>
          
          {alert.action && (
            <div className="mt-2">
              <button
                onClick={() => {
                  alert.action?.onClick();
                  handleClose();
                }}
                className={`text-sm font-medium ${colors.text} ${colors.button} px-2 py-1 rounded transition-colors`}
              >
                {alert.action.label}
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ml-4 ${colors.text} hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar for auto-close */}
      {autoClose && alert.priority !== 'high' && (
        <div className="h-1 overflow-hidden rounded-b-lg bg-gray-200">
          <div 
            className={`h-full transition-all duration-linear ${colors.bg.replace('50', '500')}`}
            style={{ 
              width: '100%',
              animation: `shrink ${autoCloseDelay}ms linear forwards`
            }}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}