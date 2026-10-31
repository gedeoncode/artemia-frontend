"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Star,
  GripVertical,
  X,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/";
import { cn } from "@/lib/utils/";
import type { UploadStatus } from "../../../../types";
import { AlertMessage } from "@/components/error/AlertMessage";
import { SectionHeader } from "../../ui/SectionHeader";
import { Badge } from "@/components/ui/";
import { Button } from "@/components/ui/";

import { Images } from "@/types";
import { FormSectionCard } from "./ui/FormSectionCard";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  transition: { duration: 0.25, ease: "easeOut" },
};

const imageGridVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

interface MediaSectionProps {
  images: Images;
  onImagesUpload: (files: File[]) => Promise<void>;
  onImageRemove: (publicId: string) => void;
  onImageReorder?: (images: ImageData[]) => void;
  onSetPrimaryImage: (publicId: string) => void;
  loading?: boolean;
  uploadStatuses?: UploadStatus[];
  uploadError?: string | null;
  maxImages: number;
  maxFileSize: number;
  acceptedFormats: string[];
  disabled?: boolean;
  stepIndex: number;
  registerStepValidity: (step: number, isValid: boolean) => void;
  className: string;
}

export function MediaSection({
  images,
  onImagesUpload,
  onImageRemove,
  onImageReorder,
  onSetPrimaryImage,
  loading,
  uploadStatuses = [],
  uploadError,
  maxImages,
  maxFileSize,
  acceptedFormats,
  disabled = false,
  stepIndex,
  registerStepValidity,
  className,
}: MediaSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const hasReachedMax = images.length >= maxImages;
  const remainingSlots = maxImages - images.length;

  // Register step validity
  useEffect(() => {
    const isValid = images.length > 0;
    registerStepValidity(stepIndex, isValid);
  }, [images, stepIndex, registerStepValidity]);

  const acceptedFormatsString = useMemo(
    () => acceptedFormats.join(","),
    [acceptedFormats]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFiles = useCallback(
    (files: File[]) => {
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of files) {
        if (!acceptedFormats.includes(file.type)) {
          errors.push(
            `"${file.name}" - invalid format. Accepted: ${acceptedFormats
              .map((f) => f.replace("image/", ""))
              .join(", ")}`
          );
          continue;
        }

        if (file.size > maxFileSize) {
          const sizeInMB = (maxFileSize / (1024 * 1024)).toFixed(1);
          errors.push(
            `"${file.name}" - too large. Max size: ${sizeInMB}MB`
          );
          continue;
        }

        if (validFiles.length + images.length >= maxImages) {
          errors.push(`Maximum ${maxImages} images allowed.`);
          break;
        }

        validFiles.push(file);
      }

      return { validFiles, errors };
    },
    [acceptedFormats, maxFileSize, maxImages, images.length]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || disabled) return;
      const files = Array.from(e.target.files);
      const { validFiles, errors } = validateFiles(files);
      if (errors.length > 0) {
        setLocalError(errors.join(" | "));
        return;
      }
      if (validFiles.length > 0) {
        setLocalError(null);
        await onImagesUpload(validFiles);
      }
      e.target.value = "";
    },
    [validateFiles, onImagesUpload, disabled]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      const { validFiles, errors } = validateFiles(files);
      if (errors.length > 0) {
        setLocalError(errors.join(" | "));
        return;
      }
      if (validFiles.length > 0) {
        setLocalError(null);
        await onImagesUpload(validFiles);
      }
    },
    [validateFiles, onImagesUpload, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveImage = useCallback(
    (publicId: string) => {
      setImageToDelete(null);
      onImageRemove(publicId);
    },
    [onImageRemove]
  );

  const handleReorderImages = useCallback(
    (newImages: Images) => {
      if (onImageReorder) {
        onImageReorder(newImages);
      }
    },
    [onImageReorder]
  );

  // Get upload status for a specific image
  const getUploadStatus = useCallback(
    (fileName?: string) => {
      if (!fileName) return null;
      return uploadStatuses.find((s) => s.fileName === fileName);
    },
    [uploadStatuses]
  );

  return (
    <TooltipProvider>
      <motion.section
        className={cn("space-y-6", className)}
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        {/* Section Header */}
        <FormSectionCard
          title="Product Media"
          description={`Upload up to ${maxImages} images to showcase your product. First image will be the cover.`}
          action={
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {images.length} / {maxImages}
              </Badge>
              {images.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {remainingSlots} slots left
                </Badge>
              )}
            </div>
          }
        >

        {/* Upload Zone */}
        <AnimatePresence mode="wait">
          {!hasReachedMax ? (
            <motion.div
              key="upload-zone"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300",
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                    : "border-gray-300 bg-gray-50/50 hover:bg-gray-50",
                  disabled && "opacity-60 cursor-not-allowed",
                  "cursor-pointer"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={disabled ? undefined : () => fileInputRef.current?.click()}
              >
                {/* Animated upload icon */}
                <motion.div
                  animate={isDragging ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload
                      className={cn(
                        "h-8 w-8 transition-colors",
                        isDragging ? "text-primary" : "text-gray-400"
                      )}
                    />
                  </div>
                </motion.div>

                <p className="mt-4 text-sm font-medium text-gray-700">
                  {isDragging ? "Drop your images here" : "Drag & drop your images here"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  or <span className="text-primary font-medium">browse files</span>
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
                  <span>Max {formatFileSize(maxFileSize)}</span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>
                    {acceptedFormats.map((f) => f.replace("image/", "")).join(", ")}
                  </span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>Up to {maxImages} images</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFormatsString}
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={disabled || loading}
                />

                {/* Upload overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="max-reached"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AlertMessage
                variant="warning"
                message={
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Maximum images reached ({maxImages}).{" "}
                    <button
                      className="text-primary underline hover:no-underline"
                      onClick={() => {
                        // Focus on first image delete button
                        const firstImage = document.querySelector(
                          '[data-image-delete]'
                        ) as HTMLButtonElement;
                        if (firstImage) firstImage.focus();
                      }}
                    >
                      Remove some
                    </button>{" "}
                    to upload more.
                  </>
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Statuses - Integrated */}
        {uploadStatuses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {uploadStatuses.map((status, index) => (
              <motion.div
                key={status.fileName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                {status.error ? (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : status.progress === 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {status.fileName}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        status.error ? "text-red-600" : "text-gray-600"
                      )}
                    >
                      {status.error ? "Failed" : `${status.progress}%`}
                    </span>
                  </div>
                  <Progress
                    value={status.progress}
                    className="h-1.5"
                    indicatorClassName={cn(
                      status.error ? "bg-red-500" : "bg-primary"
                    )}
                  />
                </div>
                {status.error && (
                  <button
                    type="button"
                    onClick={() => {
                      // Retry logic would go here
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Retry
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Error Messages */}
        {(uploadError || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 border border-red-200 rounded-lg bg-red-50"
          >
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{uploadError || localError}</p>
            <button
              type="button"
              onClick={() => setLocalError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Image Gallery */}
        {images.length > 0 && (
          <motion.div variants={imageGridVariants} initial="initial" animate="animate">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <AnimatePresence>
                {images.map((img, index) => {
                  const uploadStatus = getUploadStatus(img.fileName);
                  const isUploading = uploadStatus && uploadStatus.progress < 100;

                  return (
                    <motion.div
                      key={img.publicId}
                      variants={fadeInUp}
                      layout
                      className={cn(
                        "relative group rounded-xl overflow-hidden",
                        "border-2 transition-all duration-200",
                        "bg-white shadow-sm hover:shadow-md",
                        img.isPrimary
                          ? "border-primary/50 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300",
                        isReordering && "cursor-move"
                      )}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square">
                        <Image
                          src={img.thumbnailUrl || img.url}
                          alt={img?.altText || `Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />

                        {/* Upload Progress Overlay */}
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-10 w-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
                              <span className="text-white text-sm font-medium">
                                {Math.round(uploadStatus.progress)}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Primary Badge - Always visible */}
                        {img.isPrimary && (
                          <Badge
                            className="absolute top-2 left-2 shadow-sm"
                            variant="default"
                            size="sm"
                          >
                            <Star className="mr-1 h-3 w-3 fill-current" />
                            Cover
                          </Badge>
                        )}

                        {/* Order Number - When reordering */}
                        {isReordering && (
                          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                            #{index + 1}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Always visible on mobile, hover on desktop */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                        {/* Delete Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              data-image-delete
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageToDelete(img.publicId);
                              }}
                              disabled={disabled}
                              className={cn(
                                "p-2 rounded-full bg-white/90 backdrop-blur-sm",
                                "hover:bg-red-50 shadow-sm transition-all",
                                "focus:outline-none focus:ring-2 focus:ring-red-500",
                                disabled && "opacity-50 cursor-not-allowed",
                                "touch:opacity-100" // Always visible on touch
                              )}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Remove image</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Set Primary Button */}
                        {!img.isPrimary && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSetPrimaryImage(img.publicId);
                                }}
                                disabled={disabled}
                                className={cn(
                                  "p-2 rounded-full bg-white/90 backdrop-blur-sm",
                                  "hover:bg-amber-50 shadow-sm transition-all",
                                  "focus:outline-none focus:ring-2 focus:ring-amber-500",
                                  disabled && "opacity-50 cursor-not-allowed",
                                  "touch:opacity-100"
                                )}
                              >
                                <Star className="h-4 w-4 text-gray-600 hover:text-amber-500 transition-colors" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Set as cover</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Drag Handle - When reordering enabled */}
                        {onImageReorder && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "p-2 rounded-full bg-white/90 backdrop-blur-sm",
                                  "hover:bg-gray-50 shadow-sm transition-all",
                                  "cursor-grab active:cursor-grabbing",
                                  "touch:opacity-100"
                                )}
                              >
                                <GripVertical className="h-4 w-4 text-gray-600" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Drag to reorder</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>

                      {/* Delete Confirmation Overlay */}
                      <AnimatePresence>
                        {imageToDelete === img.publicId && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <motion.div
                              initial={{ scale: 0.9, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              exit={{ scale: 0.9, y: 10 }}
                              className="p-4 bg-white rounded-xl shadow-xl max-w-[200px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="text-sm font-medium text-center">
                                Remove this image?
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="flex-1 text-xs"
                                  onClick={() => handleRemoveImage(img.publicId)}
                                >
                                  Remove
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs"
                                  onClick={() => setImageToDelete(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add More Button - Only show if slots available */}
              {!hasReachedMax && images.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  className={cn(
                    "relative rounded-xl border-2 border-dashed border-gray-300",
                    "aspect-square flex items-center justify-center",
                    "hover:border-primary hover:bg-primary/5",
                    "transition-all duration-200 cursor-pointer"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
                    <Plus className="h-8 w-8" />
                    <span className="text-xs font-medium">Add more</span>
                    <span className="text-[10px] text-gray-300">
                      {remainingSlots} left
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="rounded-full bg-gray-100 p-4 mx-auto w-fit">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-700">
              No images uploaded yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add high-quality images to attract more buyers
            </p>
          </motion.div>
        )}

        {/* Upload Tips */}
        {images.length > 0 && images.length < maxImages && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
            <div className="flex-shrink-0 text-blue-600">
              <ImageIcon className="h-4 w-4" />
            </div>
            <p className="text-xs text-blue-700">
              Tip: Add {remainingSlots} more image{remainingSlots > 1 ? "s" : ""} to showcase different angles and details.
            </p>
          </div>
        )}
        </FormSectionCard>
      </motion.section>
    </TooltipProvider>
  );
}