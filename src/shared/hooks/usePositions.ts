import { useState, useEffect, useRef } from "react";

import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import {
  normalizeApplicationFormDataPayload,
  normalizePipelineStepsPayload,
} from "@/shared/utils/applicationFormDataAdapter";
import type { PRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";
import type {
  JobPostingListResponse,
  JobPostingDb,
  PositionFormData,
} from "@/features/external_posting";
import { positionService } from "@/features/external_posting";
import type { JobDetailResponse } from "@/features/external_posting/services/externalPosting.service";

type RequestPositionType = "prf" | "position";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function selectApplicationFormPayload(
  primaryData: Record<string, unknown>,
  secondaryData: Record<string, unknown>,
): Record<string, unknown> {
  const primaryApplicationForm = toRecord(primaryData.application_form);
  const secondaryApplicationForm = toRecord(secondaryData.application_form);

  const baseApplicationForm =
    Object.keys(primaryApplicationForm).length > 0
      ? primaryApplicationForm
      : secondaryApplicationForm;

  return {
    ...baseApplicationForm,
    non_negotiable:
      primaryData.non_negotiable ??
      secondaryData.non_negotiable ??
      baseApplicationForm.non_negotiable,
    questionnaire:
      primaryData.questionnaire ??
      secondaryData.questionnaire ??
      baseApplicationForm.questionnaire,
  };
}

function normalizeJobDetailResponse(
  response: JobDetailResponse,
  requestType?: RequestPositionType,
): PRFFormData | PositionFormData | null {
  if (!isRecord(response)) {
    return null;
  }

  if ("job_posting" in response && isRecord(response.job_posting)) {
    return response as unknown as PRFFormData | PositionFormData;
  }

  const {
    prf,
    prf_nested,
    external_posting,
    external_posting_nested,
    ...rootJobPosting
  } = response;

  const prfData = toRecord(prf);
  const prfNestedData = toRecord(prf_nested);
  const externalPostingData = toRecord(external_posting);
  const externalPostingNestedData = toRecord(external_posting_nested);

  const inferredType =
    requestType === "prf"
      ? "prf"
      : requestType === "position"
        ? "client"
        : (typeof rootJobPosting.type === "string"
            ? rootJobPosting.type
            : undefined) ||
          (Object.keys(prfData).length > 0 ||
          Object.keys(prfNestedData).length > 0
            ? "prf"
            : "client");

  if (inferredType === "prf") {
    const jobPosting = toRecord(prfData.job_posting);
    const applicationFormPayload = selectApplicationFormPayload(
      prfNestedData,
      prfData,
    );
    const pipelinePayload = prfNestedData.pipeline ?? prfData.pipeline;

    const immediateSupervisor =
      typeof prfData.immediate_supervisor === "number" ||
      prfData.immediate_supervisor === null
        ? prfData.immediate_supervisor
        : null;

    const normalizedPrf: Record<string, unknown> = {
      ...prfNestedData,
      ...prfData,
      job_posting:
        Object.keys(jobPosting).length > 0 ? jobPosting : rootJobPosting,
      immediate_supervisor: immediateSupervisor,
      immediate_supervisor_display: prfNestedData.immediate_supervisor ?? null,
      application_form: normalizeApplicationFormDataPayload(
        applicationFormPayload,
      ),
      pipeline: normalizePipelineStepsPayload(pipelinePayload),
    };

    return normalizedPrf as unknown as PRFFormData;
  }

  const externalJobPosting = toRecord(externalPostingData.job_posting);
  const externalApplicationFormPayload = selectApplicationFormPayload(
    externalPostingNestedData,
    externalPostingData,
  );
  const externalPipelinePayload =
    externalPostingNestedData.pipeline ?? externalPostingData.pipeline;

  const normalizedExternalPosting: Record<string, unknown> = {
    ...externalPostingData,
    ...externalPostingNestedData,
    job_posting:
      Object.keys(externalJobPosting).length > 0
        ? externalJobPosting
        : rootJobPosting,
    application_form: normalizeApplicationFormDataPayload(
      externalApplicationFormPayload,
    ),
    pipeline: normalizePipelineStepsPayload(externalPipelinePayload),
  };

  return normalizedExternalPosting as unknown as PositionFormData;
}

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
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      console.log(axiosError);
      if (axiosError.code === "ERR_CANCELED") return;
      setError(axiosError.response?.data?.detail || "An error occurred");
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
  requestType,
}: {
  id: number | undefined;
  non_admin?: boolean;
  requestType?: RequestPositionType;
}) {
  const [position, setPosition] = useState<
    PRFFormData | PositionFormData | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      const normalizedResponse = normalizeJobDetailResponse(
        response,
        requestType,
      );

      if (!normalizedResponse) {
        setError("Unable to load position details");
        setPosition(null);
        return;
      }

      setPosition(normalizedResponse);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{
        error?: string;
        detail?: string;
      }>;
      console.error(axiosError);
      if (axiosError.code === "ERR_CANCELED") return;
      setError(
        axiosError.response?.data?.error ||
          axiosError.response?.data?.detail ||
          "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionDetail();
  }, [id, requestType]);

  return {
    position,
    loading,
    error,
    refetch: fetchPositionDetail,
  };
}
