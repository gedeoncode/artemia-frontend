"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Image as ImageIcon,
  Upload,
  X,
  Eye,
  Link as LinkIcon,
} from "lucide-react";
import { Input, Button, Label } from "@/components/ui/";
import { Section } from "../components/Section";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { uploadImage } from "../../services/createCategory.services";

export function MediaSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageUrl = watch("image");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const { url } = await uploadImage(file);
      setValue("image", url, { shouldValidate: true });
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 500);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      clearInterval(interval);
      toast.error("Failed to upload image");
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true });
  };

  return (
    <Section
      title="Media"
      description="Visual assets for this category"
      icon={<ImageIcon className="w-4 h-4" />}
      collapsible={true}
      defaultExpanded={false}
      validationErrors={errors.image ? [errors.image.message as string] : []}
    >
      {/* Image URL Input */}
      <div className="space-y-2">
        <Label htmlFor="image">Category Image URL</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            id="image"
            className="pl-9"
            placeholder="https://example.com/category-image.jpg"
            {...register("image")}
          />
        </div>
        <p className="text-xs text-gray-500">
          Recommended size: 800x600px. Supported formats: JPEG, PNG, WebP
        </p>
      </div>

      {/* Upload Alternative */}
      <div className="space-y-2">
        <Label>Or upload from computer</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              isUploading
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 hover:border-gray-400",
            )}
          >
            {isUploading ? (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-blue-500 mx-auto animate-bounce" />
                <p className="text-sm text-gray-600">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click or drag and drop to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Image Preview</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => window.open(imageUrl, "_blank")}
                leftIcon={                <Eye className="w-4 h-4 mr-1" />
}
              >
                View
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                leftIcon={                <X className="w-4 h-4 mr-1" />
}
              >
                Remove
              </Button>
            </div>
          </div>
          <div className="relative w-full h-48 overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={imageUrl}
              alt="Category preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
          </div>
        </div>
      )}
    </Section>
  );
}
