"use client";

import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialValue = 0) {
  const [seconds, setSeconds] = useState(initialValue);

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(id);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  const start = useCallback((duration: number) => {
    setSeconds(duration);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
  }, []);

  return {
    seconds,
    running: seconds > 0,
    start,
    reset,
  };
}