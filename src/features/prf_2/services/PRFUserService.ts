import { axiosPrivate } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type { User } from "@/features/auth/types/auth.types";

export interface GetUsersByDepartmentParams {
  business_unit: string;
  department: number;
  email?: string;
  include?: string;
}

export interface GetUsersParams {
  position?: string;
}

export type UsersResponse = User[];

const buildUsersQuery = (params: GetUsersByDepartmentParams): string => {
  return [
    params.business_unit ? `business_unit=${params.business_unit}` : "",
    params.department ? `department=${params.department}` : "",
    params.email ? `email=${params.email}` : "",
    params.include ? `include_role=${params.include}` : "",
  ]
    .filter(Boolean)
    .join("&");
};

export const prfUserService = {
  async getUsersByDepartmentResponse(
    params: GetUsersByDepartmentParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<UsersResponse> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const query = buildUsersQuery(params);
    const response = await httpClient.get(`/api/user/?${query}`, {
      signal: options?.signal,
    });
    return response.data;
  },

  async getUsersResponse(
    _params?: GetUsersParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<UsersResponse> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const response = await httpClient.get(`/api/user/`, {
      signal: options?.signal,
    });
    return response.data;
  },
};
