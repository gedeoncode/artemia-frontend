"use client";

import { useCallback } from "react";

import { FiMoreVertical, FiPhone, FiMessageCircle } from "react-icons/fi";

import type { SellerLead } from "../../types/seller.lead.types";

import { LeadStatusBadge } from "../LeadStatusBadge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/";
import { LeadStatus } from "@/types";

type MobileLeadCardProps = {
  lead: SellerLead;

  onViewLead: (id: string) => void;

  onStatusChange: (lead: SellerLead, status: LeadStatus) => void;
};

export const MobileLeadCard = ({
  lead,
  onViewLead,
  onStatusChange,
}: MobileLeadCardProps) => {


  const handleView = useCallback(() => {
    onViewLead(lead._id);
  }, [lead._id, onViewLead]);

  return (
    <div
      className={`relative flex items-start justify-between p-4 rounded-lg border transition-all duration-200`}
      role="button"
      tabIndex={0}
   

      aria-label={`Select lead from ${lead.customer?.firstName ?? "unknown customer"}`}
    >
      {/* LEFT SECTION */}
      <div className="flex flex-1 flex-col gap-2">
        {/* Customer */}
        <div>
          <div className="font-semibold text-gray-900">
            {lead.customer
              ? `${lead.customer.firstName} ${lead.customer.lastName}`
              : "Unknown Customer"}
          </div>

          <div className="text-sm text-gray-500">
            {lead.customer?.email ?? "No email"}
          </div>
        </div>

        {/* Product */}
        <div className="text-sm text-gray-700">
          Product:{" "}
          <span className="font-medium text-gray-900">
            {lead.product.name}
          </span>
        </div>

        {/* Contact Method */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {lead.contactMethod === "phone" ? (
            <FiPhone className="w-4 h-4" />
          ) : (
            <FiMessageCircle className="w-4 h-4" />
          )}

          <span className="capitalize">
            {lead.contactMethod}
          </span>
        </div>

        {/* Status */}
        <LeadStatusBadge status={lead.status} />

        {/* Date */}
        <div className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleString()}
        </div>
      </div>


      {/* ACTIONS */}
      <div
        className="flex items-start ml-2"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Open lead actions menu"
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[44px] min-w-[44px]"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={handleView}
              className="flex items-center gap-2 py-2"
            >
              <span>View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead, "contacted")}
              className="flex items-center gap-2 py-2"
            >
              <span>Mark Contacted</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead, "converted")}
              className="flex items-center gap-2 py-2 text-green-600"
            >
              <span>Convert</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead, "closed")}
              className="flex items-center gap-2 py-2 text-gray-600"
            >
              <span>Close</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};