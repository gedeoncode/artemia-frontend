// app/seller/manage-leads/components/LeadTable/LeadTable.tsx
"use client";
import { LeadStatus } from "@/types";
import { SellerLead } from "../../types/seller.lead.types";


import { useState, useCallback, useTransition } from "react";

import { LeadTableHeader } from "./LeadTableHeader";
import { LeadRow } from "./LeadRow";
import { MobileLeadCard } from "./MobileLeadCard";

import { EmptyState } from "@/components/EmptyState";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

// import { LeadTableSkeleton } from "../ui/LeadTableSkeleton";

const TABLE_COLUMNS = {
  CUSTOMER: "customer",
  PRODUCT: "product",
  CONTACT_METHOD: "contactMethod",
  STATUS: "status",
  CREATED_AT: "createdAt",
  ACTIONS: "actions",
} as const;

const ACCESSIBILITY_LABELS = {
  TABLE: "Leads table with customer and status information",
  MOBILE_LIST: "Mobile leads list view",
  EMPTY_STATE: "No leads found",
} as const;

interface LeadTableProps {
  leads: SellerLead[];

  onViewLead: (id: string) => void;

  onUpdateStatus: (
    id: string,
    status: LeadStatus,
  ) => Promise<void>;

  isUpdating?: boolean;

  updateError?: string | null;

  isLoading?: boolean;
}

export function LeadTable({
  leads = [],
  onViewLead,
  onUpdateStatus,
  updateError = null,
  isLoading = false,
}: LeadTableProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState<SellerLead | null>(null);

  const [nextStatus, setNextStatus] =
    useState<LeadStatus | null>(null);

  const [localError, setLocalError] =
    useState<Error | null>(null);

  const [isUpdatingStatus, startTransition] =
    useTransition();

  const hasLeads = leads.length > 0;

  const handleStatusChangeRequest = useCallback(
    (
      lead: SellerLead,
      status: LeadStatus,
    ) => {
      setSelectedLead(lead);
      setNextStatus(status);
      setIsStatusDialogOpen(true);
    },
    [],
  );

  const handleConfirmStatusChange =
    useCallback(async () => {
      if (!selectedLead || !nextStatus) {
        return;
      }

      startTransition(async () => {
        try {
          await onUpdateStatus(
            selectedLead._id,
            nextStatus,
          );

          setIsStatusDialogOpen(false);
          setSelectedLead(null);
          setNextStatus(null);
          setLocalError(null);
        } catch (error) {
          console.error(
            "Failed to update lead status:",
            error,
          );

          setLocalError(
            error instanceof Error
              ? error
              : new Error(
                  "Failed to update lead status",
                ),
          );
        }
      });
    }, [
      selectedLead,
      nextStatus,
      onUpdateStatus,
    ]);

  const handleCancelStatusChange =
    useCallback(() => {
      setIsStatusDialogOpen(false);
      setSelectedLead(null);
      setNextStatus(null);
    }, []);

  // if (isLoading) {
  //   return <LeadTableSkeleton />;
  // }

  const displayError =
    updateError || localError;

  return (
    <div
      className="overflow-x-auto overflow-y-hidden rounded-lg shadow ring-1 ring-black/10"
      aria-label={ACCESSIBILITY_LABELS.TABLE}
      role="region"
      tabIndex={0}
    >
      {displayError && (
        <div
          role="alert"
          className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
          aria-live="polite"
        >
          <strong>Error:</strong>{" "}
          {displayError.message}
        </div>
      )}

      {/* Mobile View */}
      <div
        className="p-4 space-y-4 bg-white md:hidden"
        aria-label={
          ACCESSIBILITY_LABELS.MOBILE_LIST
        }
        role="list"
      >
        {!hasLeads ? (
          <EmptyState
            title="No leads found"
            description="No customer inquiries match your current filters."
            icon="empty"
          />
        ) : (
          leads.map((lead) => (
            <MobileLeadCard
              key={lead._id}
              lead={lead}
              onViewLead={onViewLead}
              onStatusChange={
                handleStatusChangeRequest
              }
            />
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <LeadTableHeader
            columnCount={
              Object.keys(TABLE_COLUMNS).length
            }
          />

          <tbody className="bg-white divide-y divide-gray-200">
            {!hasLeads ? (
              <tr>
                <td
                  colSpan={
                    Object.keys(TABLE_COLUMNS)
                      .length
                  }
                  className="py-12 text-center"
                  aria-label={
                    ACCESSIBILITY_LABELS.EMPTY_STATE
                  }
                >
                  <EmptyState
                    title="No leads found"
                    description="No customer inquiries match your current filters."
                    icon="empty"
                  />
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <LeadRow
                  key={lead._id}
                  lead={lead}
                  onViewLead={onViewLead}
                  onStatusChange={
                    handleStatusChangeRequest
                  }
                  isUpdating={
                    isUpdatingStatus
                  }
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={isStatusDialogOpen}
        title="Update Lead Status"
        message={
          <>
            Change lead status from{" "}
            <span className="font-medium">
              {selectedLead?.status}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {nextStatus}
            </span>
            ?
          </>
        }
        onCancel={
          handleCancelStatusChange
        }
        onConfirm={
          handleConfirmStatusChange
        }
        isLoading={isUpdatingStatus}
        confirmLabel="Update"
        cancelLabel="Cancel"
        disableConfirm={
          isUpdatingStatus
        }
        disableCancel={
          isUpdatingStatus
        }
      />
    </div>
  );
}