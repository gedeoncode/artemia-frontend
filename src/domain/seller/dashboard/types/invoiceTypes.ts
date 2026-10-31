export type InvoiceStatus = 
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'refunded'
  | 'cancelled';

export type InvoiceItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: InvoiceItem[];
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
};

export type InvoiceFilterParams = {
  status?: InvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: 'issueDate' | 'dueDate' | 'totalAmount';
  order?: 'asc' | 'desc';
};

export type InvoiceStats = {
  totalInvoices: number;
  pending: number;
  paid: number;
  overdue: number;
  totalRevenue: number;
  outstandingBalance: number;
};