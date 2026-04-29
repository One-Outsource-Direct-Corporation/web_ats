import type { AxiosInstance } from "axios";

import { defaultAxios } from "@/config/axios";

import type { IefTemplatePayload, IefTemplateRecord } from "../types/iefTemplate.types";

const unwrapList = (responseData: unknown): IefTemplateRecord[] => {
  if (Array.isArray(responseData)) {
    return responseData as IefTemplateRecord[];
  }

  if (responseData && typeof responseData === "object" && "results" in responseData) {
    const results = (responseData as { results?: IefTemplateRecord[] }).results;
    return results ?? [];
  }

  if (responseData && typeof responseData === "object") {
    return [responseData as IefTemplateRecord];
  }

  return [];
};

export const iefTemplateService = {
  async listTemplates(options?: { httpClient?: AxiosInstance; signal?: AbortSignal }) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get("/api/candidate/ief/templates/", {
      signal: options?.signal,
    });

    return unwrapList(response.data);
  },

  async detailTemplate(
    templateId: number,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get<IefTemplateRecord>(
      `/api/candidate/ief/templates/${templateId}/`,
      { signal: options?.signal },
    );

    return response.data;
  },

  async createTemplate(
    payload: IefTemplatePayload,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.post<IefTemplateRecord>(
      "/api/candidate/ief/templates/",
      payload,
    );

    return response.data;
  },

  async updateTemplate(
    templateId: number,
    payload: IefTemplatePayload,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.patch<IefTemplateRecord>(
      `/api/candidate/ief/templates/${templateId}/`,
      payload,
    );

    return response.data;
  },

  async deleteTemplate(
    templateId: number,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? defaultAxios;
    await httpClient.delete(`/api/candidate/ief/templates/${templateId}/`, {
      signal: options?.signal,
    });
  },
};
