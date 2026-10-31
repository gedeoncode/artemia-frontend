import { useState } from "react";
import { FiX, FiPrinter, FiMail, FiClock, FiDownload } from "react-icons/fi";
import { InvoiceStatusBadge } from "./InvoiceTable/InvoiceStatusBadge";
import type { Invoice } from "../../dashboard/types/invoiceTypes";

type InvoiceDetailsModalProps = {
  invoice: Invoice | null;
  onClose: () => void;
  onSendReminder: (invoiceId: string) => Promise<void>;
  onDownload: (invoiceId: string) => Promise<void>;
  sendingReminder?: boolean;
  downloading?: boolean;
};

export const InvoiceDetailsModal = ({
  invoice,
  onClose,
  onSendReminder,
  onDownload,
  sendingReminder,
  downloading,
}: InvoiceDetailsModalProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!invoice) return null;

  const handleSendReminder = async () => {
    setIsSending(true);
    try {
      await onSendReminder(invoice.id);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(invoice.id);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Invoice #{invoice.invoiceNumber}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Issued on {new Date(invoice.issueDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Customer Information
                </h4>
                <div className="p-4 rounded-md bg-gray-50">
                  <p className="font-medium">{invoice.customer.name}</p>
                  <p className="text-gray-600">{invoice.customer.email}</p>
                </div>

                <h4 className="mt-4 mb-2 font-medium text-gray-900">
                  Shipping Address
                </h4>
                <div className="p-4 rounded-md bg-gray-50">
                  <p>{invoice.shippingAddress.street}</p>
                  <p>
                    {invoice.shippingAddress.city},{" "}
                    {invoice.shippingAddress.state}{" "}
                    {invoice.shippingAddress.postalCode}
                  </p>
                  <p>{invoice.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Invoice Summary
                </h4>
                <div className="p-4 rounded-md bg-gray-50">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Status:</span>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Issue Date:</span>
                    <span>
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Due Date:</span>
                    <span>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Payment Method:</span>
                    <span className="capitalize">{invoice.paymentMethod}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Paid Date:</span>
                      <span>
                        {new Date(invoice.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.taxAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Tax:</span>
                      <span>${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.shippingAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Shipping:</span>
                      <span>${invoice.shippingAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span>Discount:</span>
                      <span>-${invoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-medium">
                    <span>Total:</span>
                    <span>${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading || downloading}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                      isDownloading || downloading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <FiDownload className="mr-2" />
                    {isDownloading || downloading
                      ? "Downloading..."
                      : "Download Invoice"}
                  </button>

                  {invoice.status === "pending" && (
                    <button
                      onClick={handleSendReminder}
                      disabled={isSending || sendingReminder}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                        isSending || sendingReminder
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      <FiClock className="mr-2" />
                      {isSending || sendingReminder
                        ? "Sending..."
                        : "Send Reminder"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h4 className="mt-6 mb-2 font-medium text-gray-900">
              Invoice Items
            </h4>
            <div className="p-4 rounded-md bg-gray-50">
              <ul className="divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <li key={item.productId} className="flex py-4">
                    <div className="flex flex-col justify-between flex-1 sm:flex-row">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h5>
                        <p className="text-sm text-gray-500">
                          SKU: {item.productId.slice(0, 8)}
                        </p>
                      </div>
                      <div className="mt-2 text-right sm:mt-0">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {invoice.notes && (
              <>
                <h4 className="mt-6 mb-2 font-medium text-gray-900">Notes</h4>
                <div className="p-4 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-700">{invoice.notes}</p>
                </div>
              </>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FiPrinter className="mr-2" />
                Print
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FiMail className="mr-2" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
