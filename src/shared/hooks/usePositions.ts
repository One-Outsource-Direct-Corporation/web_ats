import { useState, useEffect, useRef } from "react";

import type { AxiosError, AxiosResponse } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { defaultAxios } from "@/config/axios";
import type { PRFFormData } from "@/features/prf/types/prf.types";
import type {
  JobPostingAPIResponse,
  JobPostingDb,
  PositionFormData,
} from "@/features/positions-client/types/create_position.types";

export function usePositions({
  my_postings = false,
  page = 1,
  type = "",
  status = "",
  employment_type = "",
  work_setup = "",
  order_by = "",
  published = "false",
  no_active = false,
  non_admin = false,
  exclude_draft = false,
}) {
  const [positions, setPositions] = useState<
    | JobPostingAPIResponse
    | {
        count: number;
        next: string | null;
        previous: string | null;
        results: JobPostingDb[];
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
        const queryParams = [
          no_active ? `no_active=${no_active}` : "",
          page ? `page=${page}` : "",
          status ? `status=${status}` : "",
          type ? `type=${type}` : "",
          employment_type ? `employment_type=${employment_type}` : "",
          work_setup ? `work_setup=${work_setup}` : "",
          order_by ? `order_by=${order_by}` : "",
          published ? `published=${published}` : "",
          exclude_draft ? `exclude_draft=${exclude_draft}` : "",
        ]
          .filter(Boolean)
          .join("&");

        response = await defaultAxios.get(`/api/job/?${queryParams}`, {
          signal: controllerRef.current.signal,
        });
      } else {
        const queryParams = [
          my_postings ? `my_postings=${my_postings}` : "",
          no_active ? `no_active=${no_active}` : "",
          page ? `page=${page}` : "",
          status ? `status=${status}` : "",
          type ? `type=${type}` : "",
          employment_type ? `employment_type=${employment_type}` : "",
          work_setup ? `work_setup=${work_setup}` : "",
          order_by ? `order_by=${order_by}` : "",
          published ? `published=${published}` : "",
          exclude_draft ? `exclude_draft=${exclude_draft}` : "",
        ]
          .filter(Boolean)
          .join("&");

        response = await axiosPrivate.get(`/api/job/?${queryParams}`, {
          signal: controllerRef.current.signal,
        });
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
  }, [
    page,
    type,
    status,
    employment_type,
    work_setup,
    order_by,
    my_postings,
    published,
    no_active,
    non_admin,
  ]);

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
  non_admin?: boolean;
}) {
  const [position, setPosition] = useState<
    PRFFormData | PositionFormData | null
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
      let response: AxiosResponse<PRFFormData | PositionFormData>;

      if (non_admin) {
        response = await defaultAxios.get(`/api/job/${id}/`, {
          signal: controllerRef.current.signal,
        });
      } else {
        response = await axiosPrivate.get(`/api/job/${id}/`, {
          signal: controllerRef.current.signal,
        });
      }

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

  console.log(position);

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
