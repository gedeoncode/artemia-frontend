// hooks/mutations/useLeadMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";



import { leadKeys } from "@/lib/react-query/lead-keys";

import type {
  SellerLead,
  GetSellerLeadsResponse,
} from "../types/seller.lead.types";
import { LeadStatus } from "@/types";
import { updateLeadApi } from "../services/client/seller.lead.client.services";

export const useLeadMutations = () => {
  const queryClient = useQueryClient();

  /*
   |--------------------------------------------------------------------------
   | Update Single Lead Status
   |--------------------------------------------------------------------------
   */
  const updateMutation = useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      updateLeadApi( leadId, {status} ),

    /*
     * Optimistic update
     */
    onMutate: async ({ leadId, status }) => {
      await queryClient.cancelQueries({
        queryKey: leadKeys.lists(),
      });

      const previousLeadQueries = queryClient.getQueriesData<GetSellerLeadsResponse>({
        queryKey: leadKeys.lists(),
      });

      previousLeadQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, (old: GetSellerLeadsResponse) => {
          if (!old) return old;

          return {
            ...old.data,
            leads: old.data.leads.map((lead: SellerLead) =>
              lead._id === leadId ? { ...lead, status } : lead,
            ),
          };
        });
      });

      return { previousLeadQueries };
    },

    /*
     * rollback
     */
    onError: (_err, _vars, context) => {
      context?.previousLeadQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },

    /*
     * sync with server
     */
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadKeys.lists(),
      });
    },
  });

  /*
   |--------------------------------------------------------------------------
   | Return API
   |--------------------------------------------------------------------------
   */
  return {
    /*
     | Single update
     */
    updateLeadStatus: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError:
      updateMutation.error instanceof Error
        ? updateMutation.error.message
        : null,
  };
};
