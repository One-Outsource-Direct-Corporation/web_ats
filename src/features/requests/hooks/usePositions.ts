import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { PositionData } from "@/features/positions/types/positionTypes";
import type { PRFData } from "@/features/prf/types/prfTypes";
import type { AxiosError } from "axios";
import { useState, useEffect } from "react";

export function usePositions(status: string) {
  const [positions, setPositions] = useState<PositionData[] | PRFData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true);
        const response = await axiosPrivate.get(`/api/job/?status=${status}`);
        setPositions(response.data);
      } catch (err: AxiosError | any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, []);

  return { positions, loading, error };
}
