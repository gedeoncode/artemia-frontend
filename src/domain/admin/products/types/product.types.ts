// domain/admin/products/types/product.types.ts

// ======================================================
// 🔹 Shared Types
// ======================================================

export type ObjectId = string;

// ======================================================
// 🔹 Product Images
// ======================================================

export interface ProductImage {
  url: string;

  thumbnailUrl: string;

  publicId: string;

  isPrimary: boolean;
}

// ======================================================
// 🔹 Product Pricing
// ======================================================

export type DealType =
  | "fixed_price"
  | "percentage"
  | "clearance"
  | "flash_sale";

export type DealStatus = "scheduled" | "active" | "expired" | "paused";

export interface ProductDeal {
  isActive: boolean;

  type: DealType;

  label?: string;

  priority: number;

  priceMinor?: number;

  percentage?: number;

  start?: string;

  expiry?: string;

  status: DealStatus;
}

export interface ProductPricing {
  originalPriceMinor: number;

  currentPriceMinor: number;

  discountPriceMinor: number;

  listingFeeMinor: number;

  currencyCode: string;

  deal?: ProductDeal;
}

// ======================================================
// 🔹 Product Publication
// ======================================================

export type ProductPublicationStatus =
  | "draft"
  | "pending"
  | "approved"
  | "archived"
  | "rejected";
export type SortOptions =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export interface ProductPublication {
  status: ProductPublicationStatus;

  reviewedAt?: string;

  reviewedBy?: string;

  rejectionReason?: string;

  rejectionCode?: string;

  internalNote?: string;
}

// ======================================================
// 🔹 Billing
// ======================================================

export type BillingStatus = "paid" | "unpaid" | "pending" | "failed";

// ======================================================
// 🔹 Inventory
// ======================================================

export type InventoryStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "preorder";

// ======================================================
// 🔹 Shipping
// ======================================================

export interface ProductDimensions {
  length: number;

  width: number;

  height: number;

  unit: "cm" | "m" | "in" | "ft";
}

export interface ProductShipping {
  weight: number;

  dimensions: ProductDimensions;

  handoverMethod: "pickup" | "dropoff";

  pickupLocation?: string;

  dropoffHub?: string;

  customDropoffNote?: string;

  deliveryMethod?: "own_delivery" | "pickup" | "courier";

  estimatedTime?: string;

  countryOfOrigin?: string;
}

// ======================================================
// 🔹 Product Flags
// ======================================================

export interface ProductFlags {
  isFeatured: boolean;

  isNewArrival: boolean;
}

// ======================================================
// 🔹 Category
// ======================================================

export interface ProductCategory {
  _id: ObjectId;

  name: string;

  slug?: string;
}

// ======================================================
// 🔹 Seller
// ======================================================

export interface ProductSeller {
  _id: ObjectId;

  name: string;

  email?: string;

  phone?: string;
}

// ======================================================
// 🔹 Product Details Base
// ======================================================

export interface BaseProductDetails {
  categoryType: string;
}

// ======================================================
// 🔹 Car Details
// ======================================================

export interface CarProductDetails extends BaseProductDetails {
  categoryType: "car";

  brand: string;

  model: string;

  year: number;

  mileage: number;

  fuelType?: "essence" | "diesel" | "hybride" | "électrique";

  transmission?: "automatique" | "manuelle";

  condition?: "neuf" | "bon" | "usé";
}

// ======================================================
// 🔹 Real Estate Details
// ======================================================

export interface RealEstateProductDetails extends BaseProductDetails {
  categoryType: "real_estate";

  location: string;

  surface: number;

  rooms: number;

  price: number;

  propertyType?: "appartement" | "maison" | "terrain" | "bureau" | "autre";
}

// ======================================================
// 🔹 Product Details Union
// ======================================================

export type ProductDetails =
  | CarProductDetails
  | RealEstateProductDetails
  | BaseProductDetails;

// ======================================================
// 🔹 Main Product
// ======================================================

export interface Product {
  _id: ObjectId;

  name: string;

  description?: string;

  shortDescription?: string;

  pricing: ProductPricing;

  images: ProductImage[];

  category: ProductCategory | null;

  seller: ProductSeller | null;

  stock: number;

  sales: number;

  commissionModel: "PAP" | "PAL";

  details?: ProductDetails;

  shipping?: ProductShipping;

  quantity: number;

  trackQuantity: boolean;

  continueSellingWhenOutOfStock: boolean;

  taxStatus: "taxable" | "shipping" | "none";

  isDeleted: boolean;

  deletedAt?: string;

  deletedBy?: string;

  isFeatured: boolean;

  isNewArrival: boolean;

  publication: ProductPublication;

  billingStatus: BillingStatus;

  inventoryStatus: InventoryStatus;

  schemaVersion: number;

  createdAt: string;

  updatedAt: string;
}

// ======================================================
// 🔹 Pagination
// ======================================================

export interface Pagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
}

// ======================================================
// 🔹 Product Response
// ======================================================

export interface ProductResponse {
  success: boolean;

  data: Product[];

  pagination: Pagination;
}

// ======================================================
// 🔹 Fetch Params
// ======================================================

export interface FetchProductsParams {
  page?: number;

  limit?: number;

  search?: string;

  status?: ProductPublicationStatus | "all";

  billingStatus?: BillingStatus | "all";

  inventoryStatus?: InventoryStatus | "all";

  sort?: SortOptions;

  category?: string;

  seller?: string;
}
