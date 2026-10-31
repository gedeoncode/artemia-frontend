import { useEffect } from "react";

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (
  onNext: () => void,
  onPrev: () => void,
  isEnabled: boolean = true
) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, isEnabled]);
};