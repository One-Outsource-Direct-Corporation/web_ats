import { useState, useEffect } from "react";

import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type {
  JobPostingAPIResponse,
  JobPostingResponse,
} from "@/features/jobs/types/jobTypes";

export function usePositions({
  no_active = false,
  page = 1,
  status = "active",
  my_postings = false,
}) {
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
        `/api/job/?my_postings=${my_postings}&no_active=${no_active}&page=${page}&${status}`
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
  }, [page]);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
  };
}

export function usePositionDetail(id: number) {
  const [position, setPosition] = useState<JobPostingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | any>(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchPositionDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosPrivate.get(`/api/job/${id}/`);
      console.log(response.data);
      setPosition(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      setError(err.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionDetail();
  }, [id]);

  return {
    position,
    loading,
    error,
    refetch: fetchPositionDetail,
  };
}
