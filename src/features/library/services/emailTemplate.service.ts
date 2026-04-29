import type { AxiosInstance } from "axios";

import { defaultAxios } from "@/config/axios";

const buildQuery = (params: { page?: number; pageSize?: number; search?: string }) => {
  const query = new URLSearchParams();
  if (typeof params.page === "number") query.set("page", String(params.page));
  if (typeof params.pageSize === "number") query.set("page_size", String(params.pageSize));
  const trimmedSearch = params.search?.trim();
  if (trimmedSearch) query.set("search", trimmedSearch);
  return query.toString();
};

export const emailTemplateService = {
  async listResponse(
    params: { page?: number; pageSize?: number; search?: string },
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const query = buildQuery(params);
    const endpoint = query ? `/api/candidate/templates/?${query}` : "/api/candidate/templates/";
    const response = await httpClient.get(endpoint, { signal: options?.signal });
    return response.data;
  },

  async detailResponse(id: number, options?: { httpClient?: AxiosInstance; signal?: AbortSignal }) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get(`/api/candidate/templates/${id}/`, { signal: options?.signal });
    return response.data;
  },

  async createTemplate(
    payload: {
      name: string;
      category?: "general" | "interview" | "offer" | "onboarding";
      subject: string;
      body: string;
      is_active?: boolean;
    },
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.post("/api/candidate/templates/", payload);
    return response.data;
  },

  async updateTemplate(
    id: number,
    payload: {
      name?: string;
      category?: "general" | "interview" | "offer" | "onboarding";
      subject?: string;
      body?: string;
      is_active?: boolean;
    },
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.patch(`/api/candidate/templates/${id}/`, payload);
    return response.data;
  },

  async deleteTemplate(id: number, options?: { httpClient?: AxiosInstance }) {
    const httpClient = options?.httpClient ?? defaultAxios;
    await httpClient.delete(`/api/candidate/templates/${id}/`);
  },
};
