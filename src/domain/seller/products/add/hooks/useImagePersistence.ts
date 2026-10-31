import { useEffect, useCallback, useRef } from "react";

import { ImageData } from "@/types";
import { productImagePersistence } from "../utils/imagePersistence";

type UseImagePersistenceProps = {
  imageData: ImageData[];

  setImageData: (data: ImageData[]) => void;
};

export const useImagePersistence = ({
  imageData,

  setImageData,
}: UseImagePersistenceProps) => {
  const readyToPersist = useRef(false);

  /**
   * Restore images.
   */
  useEffect(() => {
    const storedImages = productImagePersistence.load();

    if (storedImages?.length) {
      setImageData(storedImages);
    }

    queueMicrotask(() => {
      readyToPersist.current = true;
    });
  }, [setImageData]);

  /**
   * Persist images.
   */
  useEffect(() => {
    if (!readyToPersist.current) {
      return;
    }

    productImagePersistence.save(imageData);
  }, [imageData]);

  /**
   * Manual cleanup.
   */
  const cleanupImageStorage = useCallback(() => {
    productImagePersistence.clear();

    setImageData([]);
  }, [setImageData]);

  return {
    cleanupImageStorage,
  };
};
