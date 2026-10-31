// src/config/upload.config.ts
export const MAX_FILE = Number(process.env.NEXT_PUBLIC_MAX_DOC_MB || 5);
export const MAX_FILE_BYTES = MAX_FILE * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/webp",
] ;

export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const; // "as const" makes it readonly & narrow types

export const ALLOWED_PRODUCT_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
] 
export const UPLOAD_TYPES = {
  ARRAY: "array",
  FIELDS: "fields",
};
export const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"]
