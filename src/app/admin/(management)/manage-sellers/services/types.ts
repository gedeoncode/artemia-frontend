export type SellerDocumentDrawerProps = {
  open: boolean;
  onClose: () => void;
  seller: Seller | null;
};

export type Seller = {
  _id: string;
  user: {

    fullName: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };
  businessName: string;
  verificationStatus: "pending" | "approved" | "rejected";
  documentsUploaded:boolean;
  documents: {
    idCardUrl: string;
    licenseUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: Date | null;
};
export interface SellerResponse {
  success: boolean;
  message: string;

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  data: Seller[];
}
export type SellerStatusUpdate = {
  status: "approved" | "rejected";
};
export type SellerDocumentsResponse = {
  SellerDocuments: {
    _id: string;
    profilePhoto: ApiDocument;
    idFront: ApiDocument;
    idBack: ApiDocument;
  };
};
export type ApiDocument = {
  url: string;
  publicId: string;
};

export type DocumentData = {
  profilePhoto: ApiDocument;
  idFront: ApiDocument;
  idBack: ApiDocument;
  // status: DocumentStatus;
  updatedAt?: string;
};
