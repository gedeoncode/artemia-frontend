import { useState, useCallback } from "react";

export function useHoverToggle(initialState = false) {
  const [isHovered, setIsHovered] = useState(initialState);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  return {
    isHovered,
    eventHandlers: { onMouseEnter, onMouseLeave },
  };
}
