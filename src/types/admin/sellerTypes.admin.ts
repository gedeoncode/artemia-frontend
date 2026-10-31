export type SellerType = "individual" | "company";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type IdDocumentType = "NATIONAL_ID" | "PASSPORT" | "VOTER_CARD";
export type CommissionModel = "PAL" | "PAP";
export type SellerStatus = "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type VerificationStatus = "pending" | "under_review" | "approved" | "rejected";
export type OnboardingStep =
  | "ADDRESS"
  | "IDENTITY"
  | "UPLOADDOCUMENTS"
  | "MODE"
  | "CONFIRMATION"
  | "COMPLETED";
export type OnboardingStatus = "pending" | "in_progress" | "completed";

export interface IdDocument {
  type: IdDocumentType;
  number?: string;
  issuedAt?: string; // ISO string from backend
  expiresAt?: string;
}

export interface Identity {
  dob?: string;
  nationality?: string; // ISO country code
  gender?: Gender;
  idDocument?: IdDocument;
}

export interface OperatingAddress {
  province?: string;
  city?: string;
  commune?: string;
  neighborhood?: string;
  avenue?: string;
  houseOrShop?: string;
  streetOrLandmark?: string;
  notes?: string;
}

export interface OnboardingTimestamps {
  startedAt?: string;
  documentsSubmittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  completedAt?: string;
}

export interface Onboarding {
  step: OnboardingStep;
  completedSteps: string[];
  draft: Record<string, any>;
  status: OnboardingStatus;
  timestamps: OnboardingTimestamps;
  completed: boolean;
}

export interface Seller {
  // Ownership
  user: string;

  // Seller identity
  sellerType: SellerType;
  businessName?: string;
  identity?: Identity;

  // Commercial setup
  commissionModel: CommissionModel;
  categories: string[];

  // Operating address
  operatingAddress?: OperatingAddress;

  // Seller lifecycle / status
  status: SellerStatus;
  isBlocked: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;

  // Verification & documents
  verificationStatus: VerificationStatus;
  documents: string[];
  documentsUploaded: boolean;

  // Onboarding
  onboarding: Onboarding;

  // Metrics / activity
  activatedAt?: string;
  suspendedAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
