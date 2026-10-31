import { apiFetch } from "@/lib/fetchLayers";
import { SELLER_PRODUCTS_ENDPOINTS } from "../constants/endpoints";


// Upload product images
export const uploadProductImage = async (files: File[]): Promise<string[]> => {
  if (process.env.NEXT_PUBLIC_USE_DIRECT_CLOUDINARY === "true") {
    return uploadDirectToCloudinary(files);
  }
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  try {
    const res = await apiFetch<{ images: string[] }>(
      `${SELLER_PRODUCTS_ENDPOINTS.UPLOAD_PRODUCT_IMAGES}`,
      {
        method: "POST",
        body: formData,
      },
    );
    return res.images;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

const uploadDirectToCloudinary = async (files: File[]): Promise<string[]> => {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration missing");
  }

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  });
  return Promise.all(uploadPromises);
};
// deleteCloudinaryImage
export const deleteCloudinaryImage = async (
  publicId: string,
): Promise<void> => {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!CLOUD_NAME) {
    throw new Error("Cloudinary configuration missing");
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { public_id: publicId },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete image: ${errorText}`);
    }
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    throw error;
  }
};
