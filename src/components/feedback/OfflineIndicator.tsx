// components/feedback/OfflineIndicator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FiWifi, FiWifiOff,  FiX } from "react-icons/fi";

interface OfflineIndicatorProps {
  onReconnect?: () => void;
  position?: "top" | "bottom";
  autoHide?: boolean;
  hideDelay?: number;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  onReconnect,
  position = "top",
  autoHide = true,
  hideDelay = 3000,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setWasOffline(true);

      // Auto-hide success notification
      if (autoHide) {
        setTimeout(() => {
          setShowNotification(false);
        }, hideDelay);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [autoHide, hideDelay]);

  const handleReconnect = () => {
    onReconnect?.();
    setShowNotification(false);
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  const isAtTop = position === "top";

  return (
    <div
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isAtTop ? "top-4" : "bottom-4"
      } ${showNotification ? "animate-in fade-in slide-in-from-top-5" : "animate-out fade-out slide-out-to-top-5"}`}
    >
      {/* Offline State */}
      {!isOnline && (
        <div className="bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]">
          <FiWifiOff className="flex-shrink-0 w-5 h-5" />
          <div className="flex-1">
            <p className="font-medium">You're offline</p>
            <p className="text-sm opacity-90">
              Some features may be unavailable
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 transition-colors rounded hover:bg-orange-600"
            aria-label="Dismiss notification"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Online State (Reconnection Success) */}
      {isOnline && wasOffline && (
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]">
          <FiWifi className="flex-shrink-0 w-5 h-5" />
          <div className="flex-1">
            <p className="font-medium">Connection restored</p>
            <p className="text-sm opacity-90">You're back online</p>
          </div>
          <div className="flex items-center space-x-2">
            {onReconnect && (
              <button
                onClick={handleReconnect}
                className="px-3 py-1 text-sm transition-colors bg-green-600 rounded hover:bg-green-700"
              >
                Refresh
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="p-1 transition-colors rounded hover:bg-green-600"
              aria-label="Dismiss notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Connection Testing Indicator */}
      {!isOnline && navigator.onLine === undefined && (
        <div className="flex items-center px-6 py-4 space-x-3 text-white bg-blue-500 rounded-lg shadow-lg">
          <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
          <div>
            <p className="font-medium">Checking connection...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook version for use in components
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
