import { axiosPrivate } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type {
  CreateDepartmentPayload,
  DepartmentEntity,
  DepartmentListQueryParams,
  DepartmentListResponse,
} from "@/features/department/types/department.types";

const buildDepartmentListQuery = (
  params: DepartmentListQueryParams = {},
): string => {
  const query = new URLSearchParams();

  if (typeof params.page === "number") {
    query.set("page", String(params.page));
  }

  const trimmedSearch = params.search?.trim();
  if (trimmedSearch) {
    query.set("search", trimmedSearch);
  }

  if (params.business_unit) {
    query.set("business_unit", params.business_unit);
  }

  if (params.nested) {
    query.set("nested", "true");
  }

  return query.toString();
};

export const departmentService = {
  async getDepartmentsResponse(
    params: DepartmentListQueryParams = {},
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<DepartmentListResponse> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const query = buildDepartmentListQuery(params);
    const url = query ? `/api/department/?${query}` : "/api/department/";

    const response = await httpClient.get<DepartmentListResponse>(url, {
      signal: options?.signal,
    });

    return response.data;
  },

  async getAllDepartmentsResponse(
    params: Omit<DepartmentListQueryParams, "page"> = {},
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<DepartmentEntity[]> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const firstPage = await departmentService.getDepartmentsResponse(
      {
        ...params,
        page: 1,
      },
      options,
    );

    const departments = [...firstPage.results];
    let nextUrl = firstPage.next;

    while (nextUrl) {
      const response = await httpClient.get<DepartmentListResponse>(nextUrl, {
        signal: options?.signal,
      });

      departments.push(...response.data.results);
      nextUrl = response.data.next;
    }

    return departments;
  },

  async createDepartment(
    payload: CreateDepartmentPayload,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<DepartmentEntity> {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const response = await httpClient.post<DepartmentEntity>(
      "/api/department/",
      payload,
      {
        signal: options?.signal,
      },
    );

    return response.data;
  },
};
