/**
 * Maps technical Cloudinary/upload errors to user-friendly messages.
 */
export interface CloudinaryErrorResult {
  userMessage: string;
  devMessage: string;
  statusCode?: number;
}

export function getCloudinaryErrorMessage(
  error: unknown
): CloudinaryErrorResult {
  let devMessage = "";
  let userMessage =
    "Something went wrong while uploading your file. Please try again.";
  let statusCode: number | undefined;

  if (error instanceof Error) {
    devMessage = error.message;

    // Try to extract a status code from the message e.g. "Cloudinary upload failed (401)"
    const match = devMessage.match(/\((\d{3})\)/);
    if (match) {
      statusCode = Number(match[1]);
    }

    // 🔹 Handle by status codes first
    switch (statusCode) {
      case 401:
        userMessage =
          "Your upload session is no longer valid. Please refresh the page and try again.";
        break;
      case 403:
        userMessage =
          "You don’t have permission to upload this file. Please contact support if the issue continues.";
        break;
      case 500:
      case 502:
      case 503:
        userMessage =
          "The upload service is temporarily unavailable. Please try again in a few minutes.";
        break;
    }

    // 🔹 Handle known text-based errors (fallback if no status code)
    if (!statusCode) {
      if (devMessage.includes("Signature request failed")) {
        userMessage =
          "We couldn’t prepare the upload. Please refresh the page and try again.";
      } else if (devMessage.includes("Failed to fetch Cloudinary signature")) {
        userMessage =
          "We couldn’t connect to the server. Please check your internet connection and try again.";
      } else if (devMessage.includes("Cloudinary upload failed")) {
        userMessage =
          "The upload could not be completed. Please check your internet connection and try again.";
      } else if (devMessage.includes("response could not be processed")) {
        userMessage =
          "Upload finished, but we couldn’t process the response. Please try again.";
      }
    }
  } else if (typeof error === "string") {
    devMessage = error;
  } else if (error && typeof error === "object") {
    devMessage = JSON.stringify(error);
  }

  // Log only in dev (in prod, send devMessage + statusCode to Sentry)
  if (process.env.NODE_ENV !== "production") {
    console.error("[Cloudinary Error]", { devMessage, statusCode, raw: error });
  }

  return { userMessage, devMessage, statusCode };
}




export function validateUploadFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
) {
  if (!file) {
    throw new Error("Please select a file before uploading.");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types are: ${allowedTypes
        .map((t) => t.split("/")[1].toUpperCase())
        .join(", ")}`
    );
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size must be less than ${maxSizeMB}MB.`);
  }
}
