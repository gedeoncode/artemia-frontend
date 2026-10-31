export const STATUS_VARIANT_MAP = {
  activated: "success",
  pending: "warning",
  deleted: "danger",
  draft: "secondary",
  archived: "secondary",
  out_of_stock: "danger",
} as const;

export const PAGE_SIZE = 10;

export const PRODUCT_REJECT_REASONS = {
  POLICY_VIOLATION: "policy_violation",
  FAKE_PRODUCT: "fake_product",
  POOR_IMAGES: "poor_images",
  WRONG_CATEGORY: "wrong_category",
  PRICING_ISSUE: "pricing_issue",
  DUPLICATE_LISTING: "duplicate_listing",
  RESTRICTED_ITEM: "restricted_item",
  INTELLECTUAL_PROPERTY: "intellectual_property",
  OTHER: "other",
} as const
export const DEFAULT_REJECTION_MESSAGES: Record<RejectReason, string> = {
  [PRODUCT_REJECT_REASONS.POLICY_VIOLATION]:
    "This product violates our marketplace policies regarding prohibited or restricted items. Please review our policy guidelines for more information.",
  [PRODUCT_REJECT_REASONS.FAKE_PRODUCT]:
    "This product appears to be counterfeit or unauthorized. We require authentic products that comply with intellectual property rights.",
  [PRODUCT_REJECT_REASONS.POOR_IMAGES]:
    "Product images do not meet our quality standards. Please provide clear, high-resolution images showing the product from multiple angles.",
  [PRODUCT_REJECT_REASONS.WRONG_CATEGORY]:
    "Product is listed in an incorrect category. Please recategorize to the appropriate category for better visibility and compliance.",
  [PRODUCT_REJECT_REASONS.PRICING_ISSUE]:
    "Pricing information is incorrect or misleading. Please ensure pricing is accurate and includes all applicable fees.",
  [PRODUCT_REJECT_REASONS.DUPLICATE_LISTING]:
    "This appears to be a duplicate listing. Please remove duplicate listings to maintain marketplace integrity.",
  [PRODUCT_REJECT_REASONS.RESTRICTED_ITEM]:
    "This item is restricted or requires additional documentation. Please verify if you have the necessary permissions to sell this item.",
  [PRODUCT_REJECT_REASONS.INTELLECTUAL_PROPERTY]:
    "Product infringes on intellectual property rights. Please ensure you have proper authorization to sell this product.",
  [PRODUCT_REJECT_REASONS.OTHER]: "",
};
export type RejectReason =
  (typeof PRODUCT_REJECT_REASONS)[keyof typeof PRODUCT_REJECT_REASONS];

 export const REASON_OPTIONS: Array<{
  label: string;
  value: RejectReason;
}> = [
  {
    label: "Policy Violation",
    value:
      PRODUCT_REJECT_REASONS.POLICY_VIOLATION,
  },
  {
    label: "Fake Product",
    value:
      PRODUCT_REJECT_REASONS.FAKE_PRODUCT,
  },
  {
    label: "Poor Images",
    value:
      PRODUCT_REJECT_REASONS.POOR_IMAGES,
  },
  {
    label: "Wrong Category",
    value:
      PRODUCT_REJECT_REASONS.WRONG_CATEGORY,
  },
  {
    label: "Pricing Issue",
    value:
      PRODUCT_REJECT_REASONS.PRICING_ISSUE,
  },
  {
    label: "Duplicate Listing",
    value:
      PRODUCT_REJECT_REASONS.DUPLICATE_LISTING,
  },
  {
    label: "Restricted Item",
    value:
      PRODUCT_REJECT_REASONS.RESTRICTED_ITEM,
  },
  {
    label: "Other",
    value: PRODUCT_REJECT_REASONS.OTHER,
  },
];
