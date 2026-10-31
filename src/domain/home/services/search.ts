import { apiFetch } from "@/lib/fetchLayers/apiFetch";
export interface SearchSuggestion {
  _id: string;
  name: string;
  images?: string[];
}
export interface SearchSuggestionResponse {
  success: boolean;
  count: number;
  data: SearchSuggestion[];
}
export const fetchSuggestions = async (query: string) => {
  return await apiFetch<SearchSuggestionResponse>(
    `/api/products/search/suggestions?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
    },
  );
};
