import { useState, useEffect, useRef } from "react";

import type { AxiosError, AxiosResponse } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { defaultAxios } from "@/config/axios";
import type {
  JobPostingAPIResponse,
  JobPostingResponsePosition,
  JobPostingResponsePRF,
} from "@/features/jobs/types/jobTypes";

export function usePositions({
  no_active = false,
  page = 1,
  status = "",
  my_postings = false,
  non_admin = false,
}) {
  const [positions, setPositions] = useState<
    | JobPostingAPIResponse
    | {
        count: number;
        next: string | null;
        previous: string | null;
        results: JobPostingResponsePosition[];
      }
  >({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  const fetchPositions = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    try {
      setLoading(true);
      setError(null);
      let response: AxiosResponse<JobPostingAPIResponse>;
      if (non_admin) {
        response = await defaultAxios.get(
          `/api/job/?no_active=${no_active}&page=${page}&status=${status}`,
          { signal: controllerRef.current.signal }
        );
      } else {
        response = await axiosPrivate.get(
          `/api/job/?my_postings=${my_postings}&no_active=${no_active}&page=${page}&status=${status}`,
          { signal: controllerRef.current.signal }
        );
      }

      setPositions(response.data);
      setLoading(false);
    } catch (err: AxiosError | any) {
      console.log(err);
      if (err.code === "ERR_CANCELED") return;
      setError(err.response?.data?.detail || "An error occurred");
      setPositions({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
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

export function usePositionDetail({
  id,
  non_admin = false,
}: {
  id: number | undefined;
  non_admin: boolean;
}) {
  const [position, setPosition] = useState<
    JobPostingResponsePRF | JobPostingResponsePosition | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | any>(null);
  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  const fetchPositionDetail = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    try {
      setLoading(true);
      setError(null);
      let response: AxiosResponse<
        JobPostingResponsePRF | JobPostingResponsePosition
      >;

      if (non_admin) {
        response = await defaultAxios.get(`/api/job/${id}/`, {
          signal: controllerRef.current.signal,
        });
      } else {
        response = await axiosPrivate.get(`/api/job/${id}/`, {
          signal: controllerRef.current.signal,
        });
      }

      console.log(response.data);
      setPosition(response.data);
    } catch (err: AxiosError | any) {
      console.error(err);
      if (err.code === "ERR_CANCELED") return;
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "An error occurred"
      );
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
