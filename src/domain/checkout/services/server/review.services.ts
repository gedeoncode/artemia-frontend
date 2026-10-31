import { serverFetch } from "@/lib/http";
import {  AddressResponse, AddressesResponse } from "../../types/types";


export const fetchAddressById = async (
  id: string,
): Promise<AddressResponse> => {
  return await serverFetch(`/api/user/orders/address/${id}`, {
    method: "GET",
    requireAuth: true,
  });
};

export const fetchAddresses = async (): Promise<AddressesResponse> => {
  return await serverFetch("/api/user/orders/addresses", {
    method: "GET",
    requireAuth: true,
  });
};