import { defaultAxios } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type { User } from "@/features/auth/types/auth.types";

export interface GetUsersByDepartmentParams {
  business_unit: string;
  department_name: string;
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
    params.department_name ? `department=${params.department_name}` : "",
    params.email ? `email=${params.email}` : "",
    params.include ? `include_role=${params.include}` : "",
  ]
    .filter(Boolean)
    .join("&");
};

export const prfService = {
  async getUsersByDepartmentResponse(
    params: GetUsersByDepartmentParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<UsersResponse> {
    const httpClient = options?.httpClient ?? defaultAxios;
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
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get(`/api/user/`, {
      signal: options?.signal,
    });
    return response.data;
  },
};
