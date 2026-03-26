import { useState, useEffect, useRef } from "react";

import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { PRFFormData } from "@/features/prf/types/prf.types";
import type {
  JobPostingListResponse,
  JobPostingResponse,
  PositionFormData,
} from "@/features/external_posting";
import { positionService } from "@/features/external_posting";

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
    | JobPostingListResponse
    | {
        count: number;
        next: string | null;
        previous: string | null;
        results: JobPostingResponse[];
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
      let response: JobPostingListResponse;
      if (non_admin) {
        response = await positionService.getPositionsResponse(
          {
            no_active,
            page,
            status,
            type,
            employment_type,
            work_setup,
            order_by,
            published,
            exclude_draft,
          },
          {
            signal: controllerRef.current.signal,
          },
        );
      } else {
        response = await positionService.getPositionsResponse(
          {
            my_postings,
            no_active,
            page,
            status,
            type,
            employment_type,
            work_setup,
            order_by,
            published,
            exclude_draft,
          },
          {
            httpClient: axiosPrivate,
            signal: controllerRef.current.signal,
          },
        );
      }

      setPositions(response);
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

      if (!id) {
        setPosition(null);
        return;
      }

      const response = await positionService.getPositionDetailResponse(
        { id },
        {
          httpClient: non_admin ? undefined : axiosPrivate,
          signal: controllerRef.current.signal,
        },
      );

      setPosition(response);
    } catch (err: AxiosError | any) {
      console.error(err);
      if (err.code === "ERR_CANCELED") return;
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "An error occurred",
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
