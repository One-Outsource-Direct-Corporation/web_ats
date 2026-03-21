import { defaultAxios } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type {
  UpdatePrfPayload,
  UpdatePositionPayload,
} from "@/features/requests/types/request-payload.types";

export interface UpdatePrfParams {
  id: number;
}

export interface UpdatePositionParams {
  id: number;
}

export const requestService = {
  async updatePrf(
    params: UpdatePrfParams,
    payload: UpdatePrfPayload,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    return httpClient.patch(`/api/prf/${params.id}/`, payload);
  },

  async updatePosition(
    params: UpdatePositionParams,
    payload: UpdatePositionPayload,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    return httpClient.patch(`/api/position/${params.id}/`, payload);
  },
};
