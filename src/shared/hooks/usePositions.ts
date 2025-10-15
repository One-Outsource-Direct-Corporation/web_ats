import { useState, useEffect } from "react";

import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { JobPostingAPIResponse } from "@/features/jobs/types/jobTypes";

export function usePositions({ no_active = false }) {
  const [positions, setPositions] = useState<JobPostingAPIResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosPrivate.get(
        `/api/job/?my_postings=true&no_active=${no_active}`
      );

      setPositions(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      setError(err.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
  };
}
