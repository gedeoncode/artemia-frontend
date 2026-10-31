import { useState, useEffect } from "react";
import {
  fetchInvoices,
  fetchInvoiceStats,
  fetchInvoiceById,
  downloadInvoice,
} from "../../dashboard/services/invoiceServices";
import type {
  Invoice,
  InvoiceFilterParams,
  InvoiceStats,
} from "../../dashboard/types/invoiceTypes";
import { sendInvoiceReminder } from "@/domain/seller/dashboard/services/invoiceServices";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<InvoiceFilterParams>({});
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [invoicesData, statsData] = await Promise.all([
          fetchInvoices(filterParams),
          fetchInvoiceStats(),
        ]);
        setInvoices(invoicesData);
        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load invoices",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filterParams]);

  const handleViewDetails = async (invoiceId: string) => {
    try {
      setLoading(true);
      const invoice = await fetchInvoiceById(invoiceId);
      setSelectedInvoice(invoice);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load invoice details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    try {
      setSendingReminder(true);
      await sendInvoiceReminder(invoiceId);
      // Refresh the invoice details
      const invoice = await fetchInvoiceById(invoiceId);
      setSelectedInvoice(invoice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reminder");
    } finally {
      setSendingReminder(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      setDownloading(true);
      const blob = await downloadInvoice(invoiceId);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to download invoice",
      );
    } finally {
      setDownloading(false);
    }
  };

  return {
    invoices,
    stats,
    loading,
    error,
    filterParams,
    setFilterParams,
    selectedInvoice,
    setSelectedInvoice,
    downloading,
    sendingReminder,
    handleViewDetails,
    handleSendReminder,
    handleDownloadInvoice,
  };
};
