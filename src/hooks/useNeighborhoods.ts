import { useEffect, useState } from "react";
import { Neighborhoods } from "@/types";
import { getNeighborhoods } from "@/services/reference/reference.service";

export function useNeighborhoods() {
  const [data, setData] = useState<Neighborhoods[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await getNeighborhoods();
        setData(response);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading, error };
}
