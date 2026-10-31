import type {
  ContactMethod,
  LeadSource,
  LeadStatus,
  Pagination,
  UserSummary,
} from "@/types";
import { ProductSummary } from "@/types/product";

export interface SellerLead {
  _id: string;

  status: LeadStatus;

  contactMethod: ContactMethod;

  source: LeadSource;

  notes: string;

  estimatedSaleAmount: number;

  product: ProductSummary;

  customer: UserSummary | null;

  convertedAt: string;

  lastContactedAt: string;

  createdAt: string;

  updatedAt: string;
}

export interface SellerLeadDetails extends SellerLead {}

export interface GetSellerLeadsResponse {
  data: {
    leads: SellerLeadDetails[];

    pagination: Pagination;
  };
}

export interface GetSellerLeadResponse {
  data: SellerLead;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;

  notes?: string;

  estimatedSaleAmount?: number;
}

export interface UpdateLeadResponse {
  message: string;

  data: SellerLeadDetails;
}

export interface LeadFilterParams {
  status: LeadStatus;

  contactMethod?: ContactMethod;

  page?: number;

  limit?: number;
}