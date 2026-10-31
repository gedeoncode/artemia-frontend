export type Gender = "MALE" | "FEMALE" | "OTHER";
export type IdDocumentType = "NATIONAL_ID" | "PASSPORT" | "VOTER_CARD";
export type CommissionModel = "PAL" | "PAP";
export type SellerStatus = "ONBOARDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type VerificationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";
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

export type SellerInfo = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  identity?: Identity;
  status?: SellerStatus;
  verificationStatus?: VerificationStatus;
  rejectionReason: string;
  role?: string;
  categories: string[];
  businessName: string;
  commissionModel: CommissionModel;
  operatingAddress?: OperatingAddress;
  documentUrl?: string;
  activatedAt?: string;
  suspendedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProfileUpdateParams = Partial<SellerInfo>;
export type PasswordChangeParams = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string
};
export type SellerResponse = {
  data: SellerInfo;
}