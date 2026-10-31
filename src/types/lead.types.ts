export type LeadStatus =
  | "new"
  | "contacted"
  | "converted"
  | "closed";

export type ContactMethod =
  | "phone"
  | "whatsapp";

export type LeadSource =
  | "product_page"
  | "search"
  | "homepage"
  | "recommendation";

export type HandledBy =
  | "seller"
  | "admin";

  export interface Lead {
  _id: string;

  seller: string;

  product: string;

  customer: string | null;

  handledBy: HandledBy;

  contactMethod: ContactMethod;

  status: LeadStatus;

  notes: string;

  estimatedSaleAmount: number;

  source: LeadSource;

  createdAt: string;

  updatedAt: string;
}