import { useState } from 'react';

export function useImageLoaded() {
  const [isLoaded, setIsLoaded] = useState(false);

  return {
    isLoaded,
    handleLoad: () => setIsLoaded(true),
  };
}