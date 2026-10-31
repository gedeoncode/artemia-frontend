import { useState, useCallback } from "react";
import axios from "axios";
import { useImagePersistence } from "./useImagePersistence";
import type { UploadStatus } from "../../types/product.types";
import {
  ALLOWED_PRODUCT_FILE_TYPES,
  MAX_FILE,
  MAX_FILE_BYTES,
} from "@/constants";
import { ImageData } from "@/types";
import { deleteProductImageApi } from "../services/client";

interface UseImageUploadOptions {
  maxImages?: number;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
}

export const useImageUpload = ({
  maxImages = MAX_FILE,
  maxFileSize = MAX_FILE_BYTES, // 5MB default
  acceptedFormats = ALLOWED_PRODUCT_FILE_TYPES,
}: UseImageUploadOptions = {}) => {
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🧩 Persistent local storage integration (auto-expiration + inactivity cleanup)
  const { cleanupImageStorage } = useImagePersistence({imageData, setImageData});

  // 🧰 Validation logic
  const validateFiles = useCallback(
    (files: File[]): { validFiles: File[]; errors: string[] } => {
      const errors: string[] = [];
      const validFiles: File[] = [];

      files.forEach((file) => {
        if (!acceptedFormats.includes(file.type)) {
          errors.push(
            `"${file.name}" is not supported. Accepted: ${acceptedFormats
              .map((f) => f.replace("image/", "").toUpperCase())
              .join(", ")}`,
          );
          return;
        }

        if (file.size > maxFileSize) {
          const sizeInMB = (maxFileSize / (1024 * 1024)).toFixed(1);
          errors.push(
            `"${file.name}" is too large. Max allowed size: ${sizeInMB}MB.`,
          );
          return;
        }

        if (validFiles.length + imageData.length >= maxImages) {
          errors.push(`Maximum of ${maxImages} images allowed.`);
          return;
        }

        validFiles.push(file);
      });

      return { validFiles, errors };
    },
    [acceptedFormats, maxFileSize, maxImages, imageData.length],
  );

  // 📤 Upload handler
  const handleImagesUpload = useCallback(
    async (files: File[], onSuccess?: (images: ImageData[]) => void) => {
      const { validFiles, errors } = validateFiles(files);
      if (errors.length > 0) {
        setUploadError(errors.join(" • "));
        return;
      }
      if (validFiles.length === 0) return;

      setUploadError(null);
      setIsUploading(true);

      const newStatuses: UploadStatus[] = validFiles.map((file) => ({
        fileName: file.name,
        progress: 0,
      }));
      setUploadStatuses((prev) => [...prev, ...newStatuses]);

      try {
        const fd = new FormData();
        validFiles.forEach((file) => fd.append("images", file));

        const res = await axios.post(`/api/seller/products/images`, fd, {
          withCredentials: true,
          onUploadProgress: (e) => {
            if (e.total) {
              const progress = Math.round((e.loaded * 100) / e.total);
              setUploadStatuses((prev) =>
                prev.map((s) =>
                  validFiles.some((f) => f.name === s.fileName)
                    ? { ...s, progress }
                    : s,
                ),
              );
            }
          },
        });
        if (res.data.success) {
          const newImages: ImageData[] = res.data.images.map(
            (url: string, i: number) => ({
              url,
              thumbnailUrl: res.data.thumbnails[i],
              publicId: res.data.publicIds[i],
              fileName: validFiles[i]?.name,
              isPrimary: false,
            }),
          );

          setImageData((prev) => [...prev, ...newImages]);
          onSuccess?.(newImages);
        } else {
          setUploadError(
            res.data.message || "Image upload failed. Please try again.",
          );
        }
      } catch (err) {
        const axiosMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : null;
        setUploadError(
          axiosMessage ??
            (err instanceof Error ? err.message : "Image upload failed."),
        );
      } finally {
        setIsUploading(false);
      }
    },
    [validateFiles],
  );

  // 🗑️ Remove image (server + local cleanup)
  const removeImage = useCallback(
    async (publicId: string, onRollback?: () => void) => {
      setImageData((prev) => {
        const target = prev.find((img) => img.publicId === publicId);
        if (!target) return prev;
        // Optimistic removal
        return prev.filter((img) => img.publicId !== publicId);
      });
      try {
        await deleteProductImageApi(publicId);
        // Clean up only if no images left
        setImageData((current) => {
          if (current.length === 0) {
            cleanupImageStorage();
          }
          return current;
        });
      } catch (error) {
        console.error("Image deletion failed:", error);
        // Rollback state precisely if deletion fails
        setImageData((prev) => {
          const isStillMissing = !prev.some((img) => img.publicId === publicId);
          if (isStillMissing) {
            const removedImg = imageData.find(
              (img) => img.publicId === publicId,
            );
            return removedImg ? [...prev, removedImg] : prev;
          }
          return prev;
        });
        onRollback?.();

        // Optional: add error state for UI
        setUploadError("Failed to remove image. Please try again.");
      }
    },
    [cleanupImageStorage, imageData],
  );
  // 🌟 Set primary image
  const handleSetPrimaryImage = useCallback((publicId: string) => {
    setImageData((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.publicId === publicId,
      })),
    );
  }, []);

  return {
    imageData,
    setImageData,
    uploadStatuses,
    uploadError,
    isUploading,
    handleImagesUpload,
    removeImage,
    handleSetPrimaryImage,
    maxImages,
    maxFileSize,
    acceptedFormats,
  };
};
