
export const SELLER_PRODUCTS_ENDPOINTS = {
  GET_ALL_PRODUCTS: "/api/v1/seller/products",
  BULK_ACTION: "/api/v1/seller/products/bulk",
  SOFT_DELETE: "/api/v1/seller/products/soft-delete/",
  CREATE_PRODUCT: "/api/v1/seller/products/add",
  MARK_AS_PAID: "/api/v1/seller/products/mark-as-paid/",
  UPDATE_PRODUCT: "/api/v1/seller/products/update-product/",
  GET_PRODUCT: "/api/v1/seller/products/",
  GET_CATEGORIES: "/api/v1/seller/auth/categories",
  GET_PAYMENT_SESSION: "/api/v1/seller/product/payment-session/",
  UPLOAD_PRODUCT_IMAGES: "/api/v1/seller/products/upload-images",
  DELETE_PRODUCT_IMAGES: "/api/v1/seller/products/image/delete-image",
} as const;