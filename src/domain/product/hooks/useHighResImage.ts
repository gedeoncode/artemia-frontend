import { useCallback, useState } from "react";

export function useHighResImage() {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const measureNaturalResolution = useCallback((url: string) => {
    const img = new window.Image();
    img.src = url;

    img.onload = () => {
      setNaturalSize({
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
      });
    };
  }, []);

  return { naturalSize, measureNaturalResolution };
}
