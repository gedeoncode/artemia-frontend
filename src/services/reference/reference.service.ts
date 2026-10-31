import { staticFetch } from "@/lib/fetchLayers/staticFetch";
import { Avenues, Neighborhoods } from "@/types";

export async function getAvenues(): Promise<Avenues[]> {
  return staticFetch<Avenues[]>("/api/v1/reference/avenues");
}
export async function getNeighborhoods(): Promise<Neighborhoods[]> {
  return staticFetch<Neighborhoods[]>("/api/v1/reference/neighborhoods");
}
