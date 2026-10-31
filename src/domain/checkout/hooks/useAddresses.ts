// hooks/useAddresses.ts

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { logger } from "@/lib/logger";

import { fetchAddressesApi } from "../services/client/reviewClient.services";
import { Address } from "../types/types";

const ADDRESSES_QUERY_KEY = ["addresses"];

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const {
    data: addresses = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Address[], Error>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      try {
        const result = await fetchAddressesApi();

        return Array.isArray(result?.data) ? result.data : [];
      } catch (err) {
        logger.error("Failed to fetch addresses:", err);

        throw err instanceof Error
          ? err
          : new Error("Une erreur s'est produite");
      }
    },
  });

  const addAddress = (address: Address) => {
    queryClient.setQueryData<Address[]>(
      ADDRESSES_QUERY_KEY,
      (current = []) => [address, ...current],
    );
  };

  return {
    addresses,
    isLoading,
    error: error?.message ?? null,

    refetch,
    addAddress,
  };
};