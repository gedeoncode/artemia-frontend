import { useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

type UseAutoCleanupOptions = {
  enabled?: boolean;

  inactivityTimeout?: number;

  expirationCheckInterval?: number;

  showToast?: boolean;

  toastMessage?: string;

  toastDescription?: string;

  clear: () => void;

  isExpired: () => boolean;

  refreshExpiration: () => void;
};

export const useAutoCleanup = ({
  enabled = true,

  inactivityTimeout = 1000 * 60 * 30, // 30 min

  expirationCheckInterval = 1000 * 60, // 1 min

  showToast = true,

  toastMessage =
    "Your saved product draft has been cleared.",

  toastDescription =
    "You can start a new product listing anytime.",

  clear,

  isExpired,

  refreshExpiration,
}: UseAutoCleanupOptions) => {
  const inactivityTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  /**
   * Prevent excessive localStorage writes
   * while user is actively typing.
   */
  const lastRefreshRef = useRef(0);

  const handleCleanup = useCallback(() => {
    clear();

    if (showToast) {
      toast.info(
        `${toastMessage}\n\n${toastDescription}`,
        {
          autoClose: 6000,
        }
      );
    }
  }, [
    clear,
    showToast,
    toastMessage,
    toastDescription,
  ]);

  const onActivity = useCallback(() => {
    if (!enabled) return;

    const now = Date.now();

    /**
     * Refresh expiration at most once
     * every 30 seconds.
     */
    if (now - lastRefreshRef.current > 30_000) {
      refreshExpiration();

      lastRefreshRef.current = now;
    }

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      handleCleanup();
    }, inactivityTimeout);

  }, [
    enabled,

    inactivityTimeout,

    refreshExpiration,

    handleCleanup,
  ]);

  /**
   * Listen for user activity.
   */
  useEffect(() => {
    if (!enabled) return;

    const activityEvents = [
      "keydown",

      "click",

      "scroll",

      "touchstart",
    ];

    activityEvents.forEach((evt) =>
      window.addEventListener(
        evt,

        onActivity,

        {
          passive: true,
        }
      )
    );

    onActivity();

    return () => {

      activityEvents.forEach((evt) =>
        window.removeEventListener(
          evt,

          onActivity
        )
      );

      if (inactivityTimer.current) {

        clearTimeout(
          inactivityTimer.current
        );

      }

    };

  }, [enabled, onActivity]);

  /**
   * Poll expiration.
   */
  useEffect(() => {

    if (!enabled) return;

    intervalRef.current = setInterval(() => {

      if (isExpired()) {

        handleCleanup();

      }

    }, expirationCheckInterval);

    return () => {

      if (intervalRef.current) {

        clearInterval(
          intervalRef.current
        );

      }

    };

  }, [

    enabled,

    isExpired,

    handleCleanup,

    expirationCheckInterval,

  ]);
};