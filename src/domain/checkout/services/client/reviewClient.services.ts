import { clientFetch } from "@/lib/http";
import { AddressResponse } from "../../types/types";

export const fetchAddressByIdApi = async (
  id: string,
): Promise<AddressResponse> => {
  return await clientFetch(`/api/checkout/addresses/${id}`, {
    method: "GET",
  });
};
export const fetchAddressesApi = async (): Promise<AddressResponse> => {
  return await clientFetch(`/api/checkout/addresses`, {
    method: "GET",
  });
};
