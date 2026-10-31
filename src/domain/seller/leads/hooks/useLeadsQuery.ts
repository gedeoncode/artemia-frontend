// hooks/useLeadsQuery.ts

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchSellerLeadsApi } from "../services/client/seller.lead.client.services";

import type {
  SellerLead,
  LeadFilterParams,
} from "../types/seller.lead.types";

import { leadKeys } from "@/lib/react-query/lead-keys";

type InitialData = {
  leads: SellerLead[];
  page: number;
  pages: number;
};

interface UseLeadsQueryProps {
  initialData?: InitialData;
  initialFilterParams: LeadFilterParams;
}

export const useLeadsQuery = ({
  initialData,
  initialFilterParams,
}: UseLeadsQueryProps) => {
  const [filterParams, setFilterParams] =
    useState<LeadFilterParams>(initialFilterParams);

  const query = useQuery({
    queryKey: leadKeys.list(filterParams),

    queryFn: () => fetchSellerLeadsApi(filterParams),

    initialData,
  });

  return {
    /*
     |--------------------------------------------------------------------------
     | Data
     |--------------------------------------------------------------------------
     */
    leads: query.data?.leads ?? [],

    pagination: {
      page: query.data?.page ?? 1,
      pages: query.data?.pages ?? 1,
    },

    /*
     |--------------------------------------------------------------------------
     | Filters
     |--------------------------------------------------------------------------
     */
    filterParams,
    setFilterParams,

    /*
     |--------------------------------------------------------------------------
     | State
     |--------------------------------------------------------------------------
     */
    isLoading: query.isLoading,
    isFetching: query.isFetching,

    error:
      query.error instanceof Error
        ? query.error.message
        : null,

    /*
     |--------------------------------------------------------------------------
     | Utilities
     |--------------------------------------------------------------------------
     */
    refetch: query.refetch,
  };
};