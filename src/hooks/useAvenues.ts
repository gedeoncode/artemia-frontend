import { useEffect, useState } from "react";
import { Avenues } from "@/types";
import { getAvenues } from "@/services/reference/reference.service";
export function useAvenues() {
  const [data, setData] = useState<Avenues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await getAvenues();
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
