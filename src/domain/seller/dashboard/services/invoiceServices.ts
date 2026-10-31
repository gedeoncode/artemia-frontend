import { API_BASE_URL } from '@/config/env';
import type { Invoice, InvoiceFilterParams, InvoiceStats } from '../types/invoiceTypes';

export const fetchInvoices = async (params?: InvoiceFilterParams): Promise<Invoice[]> => {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.dateFrom) query.append('dateFrom', params.dateFrom);
  if (params?.dateTo) query.append('dateTo', params.dateTo);
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.order) query.append('order', params.order);

  const response = await fetch(`${API_BASE_URL}/api/seller/invoices?${query.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return await response.json();
};

export const fetchInvoiceStats = async (): Promise<InvoiceStats> => {
  const response = await fetch(`${API_BASE_URL}/api/seller/invoices/stats`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch invoice stats');
  return await response.json();
};

export const fetchInvoiceById = async (invoiceId: string): Promise<Invoice> => {
  const response = await fetch(`${API_BASE_URL}/api/seller/invoices/${invoiceId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch invoice');
  return await response.json();
};

export const sendInvoiceReminder = async (invoiceId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/seller/invoices/${invoiceId}/reminder`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
    }
  });
  if (!response.ok) throw new Error('Failed to send reminder');
};

export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/seller/invoices/${invoiceId}/download`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
    }
  });
  if (!response.ok) throw new Error('Failed to download invoice');
  return await response.blob();
};