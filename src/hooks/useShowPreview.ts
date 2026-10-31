import { useRef, useState } from "react";

export function useShowPreview() {
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowPreview(false), 250);
  };

  return { showPreview, handleMouseEnter, handleMouseLeave };
}
