import { defaultAxios } from "@/config/axios";
import type { AxiosInstance } from "axios";
import { clientService } from "@/features/client/services/client.service";
import type {
  ClientResponse,
  GetPositionsParams,
  JobPostingListResponse,
  PositionFormData,
} from "@/features/external_posting/types/externalPosting.types";
import type { PRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";

export interface GetPositionDetailParams {
  id: number;
}

export interface JobDetailResponse {
  type?: "prf" | "client";
  prf?: Record<string, unknown> | null;
  prf_nested?: Record<string, unknown> | null;
  external_posting?: Record<string, unknown> | null;
  external_posting_nested?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export type PositionDetailResponse = PRFFormData | PositionFormData;
export type PositionsResponse = JobPostingListResponse;
export type ClientsResponse = ClientResponse[];

const buildQueryString = (params: GetPositionsParams): string => {
  return [
    params.my_postings ? `my_postings=${params.my_postings}` : "",
    params.no_active ? `no_active=${params.no_active}` : "",
    params.page ? `page=${params.page}` : "",
    params.status ? `status=${params.status}` : "",
    params.type ? `type=${params.type}` : "",
    params.employment_type ? `employment_type=${params.employment_type}` : "",
    params.work_setup ? `work_setup=${params.work_setup}` : "",
    params.order_by ? `order_by=${params.order_by}` : "",
    params.published ? `published=${params.published}` : "",
    params.exclude_draft ? `exclude_draft=${params.exclude_draft}` : "",
  ]
    .filter(Boolean)
    .join("&");
};

export const externalPostingService = {
  async getPositionsResponse(
    params: GetPositionsParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<PositionsResponse> {
    const query = buildQueryString(params);
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get(`/api/job/?${query}`, {
      signal: options?.signal,
    });
    return response.data;
  },

  async getPositionDetailResponse(
    params: GetPositionDetailParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<JobDetailResponse> {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get<JobDetailResponse>(
      `/api/job/${params.id}/`,
      {
        signal: options?.signal,
      },
    );
    return response.data;
  },

  async getClientsResponse(options?: {
    httpClient?: AxiosInstance;
    signal?: AbortSignal;
  }): Promise<ClientsResponse> {
    return clientService.getAllClientsResponse({}, options);
  },
};

export const positionService = externalPostingService;
