
import { UIProduct, SellerInfo, ProductPricing } from "@/domain/product/types";
import { AdaptedProduct } from "@/domain/product/types/adapted-product.types";
import { ImageData } from "@/types";

export function adaptProduct(product: UIProduct): AdaptedProduct {

  return {
    id: product._id ,

    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,

    // =====================================================
    // Pricing 
    // =====================================================
    price: {
      current: toMoney(product?.pricing?.currentPriceMinor),
      original: toMoney(product?.pricing?.originalPriceMinor),
      currency: product?.pricing?.currencyCode ?? "USD",

      effective: toMoney(product?.pricing?.effectivePriceMinor),

      discount: computeDiscount(product.pricing),
    },

    // =====================================================
    // Rating 
    // =====================================================
    rating: product?.rating ?? 0,
    reviewCount: product?.reviewCount ?? 0,

    // =====================================================
    // Seller 
    // =====================================================
    seller: adaptSeller(product?.seller ),

    // =====================================================
    // Category
    // =====================================================
    category: product?.category,

    // =====================================================
    // Lmages
    // =====================================================
    images: (product?.images || []).map((img: ImageData) => img.url),

    // =====================================================
    // Inventory
    // =====================================================
    stock: product?.stock ?? 0,
    availability: {
      inStock: (product?.stock ?? 0 ) > 0,
      quantity: product?.stock ?? 0,
      status: product?.inventoryStatus,
      isPurchasable: product?.isPurchasable ?? false,
    },

    // =====================================================
    // Shipping 
    // =====================================================
    shipping: product?.shipping,
    // =====================================================
    // Details 
    // =====================================================
    details: product?.details,
  };
}

// =====================================================
// SELLER ADAPTER (SAFE OUTPUT LAYER)
// =====================================================
function adaptSeller(seller?: SellerInfo) {
  if (!seller) return null;

  return {
    id: seller._id,
    name: seller.user?.name,
    email: seller.user?.email,
    phone: seller.user?.phone,
    businessName: seller?.businessName,
    sellerType: seller.sellerType,

    rating: seller.rating ?? 0,
    totalReviews: seller.totalReviews ?? 0,

    verified: seller.verified ?? false,

    location: seller.location,

    since: seller.since,

    responseTime: seller.responseTime,

    onlineSince: seller.onlineSince,
  };
}

// =====================================================
// PRICING HELPERS
// =====================================================
function toMoney(value?: number) {
  if (typeof value !== "number") return 0;
  return value / 100;
}

function computeDiscount(pricing?: ProductPricing ) {
  const current =pricing?.currentPriceMinor;
  const original = pricing?.originalPriceMinor;

  if (!current || !original || original <= current) return undefined;

  const amount = original - current;
  const percentage = Math.round((amount / original) * 100);

  return {
    amount: toMoney(amount),
    percentage,
  };
}

