import { useState, useEffect } from "react";

import type { PositionData } from "../../features/positions/types/positionTypes";
import type { PRFData } from "@/features/prf/types/prfTypes";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

export function usePositions(status = "active") {
  const [positions, setPositions] = useState<PositionData[] | PRFData[] | []>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function fetchPositions() {
      try {
        setLoading(true);
        const response = await axiosPrivate.get<PositionData[] | PRFData[]>(
          `/api/job/?my_posts=true&status=${status}`
        );

        setPositions(response.data);
      } catch (err: AxiosError | any) {
        console.log(err);
        setError(err.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, []);

  return {
    positions,
    loading,
    error,
  };
}
