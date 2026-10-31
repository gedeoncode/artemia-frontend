// hooks/useManageLeads.ts

import { useRouter } from "next/navigation";

import { useLeadsQuery } from "./useLeadsQuery";
import { useLeadMutations } from "./useLeadMutations";

import type {
  SellerLead,
  LeadFilterParams,
} from "../types/seller.lead.types";
import { LeadStatus } from "@/types";

type InitialData = {
  leads: SellerLead[];
  page: number;
  pages: number;
};

interface UseManageLeadsProps {
  initialData: InitialData;
  initialFilterParams: LeadFilterParams;
}

export const useManageLeads = ({
  initialData,
  initialFilterParams,
}: UseManageLeadsProps) => {
  const router = useRouter();

  /*
   |--------------------------------------------------------------------------
   | Leads Query Layer
   |--------------------------------------------------------------------------
   */
  const {
    leads,
    pagination,
    isLoading,
    isFetching,
    error,
    filterParams,
    setFilterParams,
  } = useLeadsQuery({
    initialData,
    initialFilterParams,
  });

  const {
    updateLeadStatus,
    isUpdating,
    updateError,

    isBulkUpdating,
    bulkError,
  } = useLeadMutations();

  const handleUpdateStatus = async (
    leadId: string,
    status: LeadStatus,
  ) => {
    await updateLeadStatus({
      leadId,
      status,
    });


  };


  const handleViewLead = (leadId: string) => {
    router.push(
      `/seller/dashboard/leads/${leadId}`,
    );
  };

  return {
    /*
     |--------------------------------------------------------------------------
     | Data
     |--------------------------------------------------------------------------
     */
    leads,
    pagination,
    isLoading,
    isFetching,
    error,

    /*
     |--------------------------------------------------------------------------
     | Filters
     |--------------------------------------------------------------------------
     */
    filterParams,
    setFilterParams,


    /*
     |--------------------------------------------------------------------------
     | Mutations
     |--------------------------------------------------------------------------
     */
    handleUpdateStatus,
    isUpdating,
    updateError,
    isBulkUpdating,
    bulkError,

    /*
     |--------------------------------------------------------------------------
     | Navigation
     |--------------------------------------------------------------------------
     */
    handleViewLead,
  };
};