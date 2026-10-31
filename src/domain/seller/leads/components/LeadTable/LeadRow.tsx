// app/seller/dashboard/manage-leads/components/LeadTable/LeadRow.tsx
"use client";

import { useState, useCallback } from "react";

import type { SellerLead } from "../../types/seller.lead.types";
import { LeadStatusBadge } from "../LeadStatusBadge";

type LeadRowProps = {
  lead: SellerLead;

  onViewLead: (id: string) => void;

  onStatusChange: (lead: SellerLead, status: SellerLead["status"]) => void;

  isUpdating: boolean;
};

export const LeadRow = ({
  lead,
  onViewLead,
  onStatusChange,
  isUpdating,
}: LeadRowProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenLead = useCallback(() => {
    setOpen(false);
    onViewLead(lead._id);
  }, [lead._id, onViewLead]);

  const handleQuickStatus = useCallback(
    (status: SellerLead["status"]) => {
      setOpen(false);
      onStatusChange(lead, status);
    },
    [lead, onStatusChange],
  );

  const disabled = isUpdating;

  return (
    <tr
      className={`border-b transition ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
      }`}
    >
      {/* Customer */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">
          {lead.customer
            ? `${lead.customer.firstName} ${lead.customer.lastName}`
            : "Unknown"}
        </div>

        <div className="text-sm text-gray-500">
          {lead.customer?.email ?? "No email"}
        </div>
      </td>

      {/* Product */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">
          {lead.product.name}
        </div>

        <div className="text-sm text-gray-500">
          SKU: {lead.product._id.slice(0, 8)}
        </div>
      </td>

      {/* Contact Method */}
      <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-700">
        {lead.contactMethod}
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <LeadStatusBadge status={lead.status} />
      </td>

      {/* Created */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right whitespace-nowrap">
        {disabled ? (
          <div className="flex items-center justify-end text-gray-500">
            <span>Updating...</span>
          </div>
        ) : (
          <div className="flex justify-end gap-3">
            {/* View Lead */}
            <button
              onClick={handleOpenLead}
              className="text-sm text-blue-600 hover:underline"
            >
              View
            </button>

            {/* Quick Status Actions */}
            <button
              onClick={() => handleQuickStatus("contacted")}
              className="text-sm text-yellow-600 hover:underline"
            >
              Contacted
            </button>

            <button
              onClick={() => handleQuickStatus("converted")}
              className="text-sm text-green-600 hover:underline"
            >
              Convert
            </button>

            <button
              onClick={() => handleQuickStatus("closed")}
              className="text-sm text-gray-600 hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};