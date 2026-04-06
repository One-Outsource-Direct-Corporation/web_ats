import type { AxiosInstance } from "axios";

import { defaultAxios } from "@/config/axios";
import type {
  CreateQuestionnaireTemplatePayload,
  QuestionnaireTemplateDetail,
  QuestionnaireTemplateDetailParams,
  QuestionnaireTemplateListParams,
  QuestionnaireTemplateListResponse,
  UpdateQuestionnaireTemplatePayload,
} from "../types/questionnaireTemplate.types";

const buildQuery = (params: QuestionnaireTemplateListParams): string => {
  const query = new URLSearchParams();

  if (typeof params.page === "number") {
    query.set("page", String(params.page));
  }

  if (typeof params.pageSize === "number") {
    query.set("page_size", String(params.pageSize));
  }

  const trimmedSearch = params.search?.trim();
  if (trimmedSearch) {
    query.set("search", trimmedSearch);
  }

  return query.toString();
};

export const questionnaireTemplateService = {
  async listResponse(
    params: QuestionnaireTemplateListParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<QuestionnaireTemplateListResponse> {
    const httpClient = options?.httpClient ?? defaultAxios;
    const query = buildQuery(params);
    const endpoint = query
      ? `/api/application_form_questionnaire/templates/?${query}`
      : "/api/application_form_questionnaire/templates/";

    const response = await httpClient.get<QuestionnaireTemplateListResponse>(
      endpoint,
      { signal: options?.signal },
    );
    return response.data;
  },

  async detailResponse(
    params: QuestionnaireTemplateDetailParams,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<QuestionnaireTemplateDetail> {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.get<QuestionnaireTemplateDetail>(
      `/api/application_form_questionnaire/templates/${params.id}/`,
      { signal: options?.signal },
    );
    return response.data;
  },

  async createTemplate(
    payload: CreateQuestionnaireTemplatePayload,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<QuestionnaireTemplateDetail> {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.post<QuestionnaireTemplateDetail>(
      "/api/application_form_questionnaire/templates/",
      payload,
      { signal: options?.signal },
    );
    return response.data;
  },

  async updateTemplate(
    templateId: number,
    payload: UpdateQuestionnaireTemplatePayload,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<QuestionnaireTemplateDetail> {
    const httpClient = options?.httpClient ?? defaultAxios;
    const response = await httpClient.patch<QuestionnaireTemplateDetail>(
      `/api/application_form_questionnaire/templates/${templateId}/`,
      payload,
      { signal: options?.signal },
    );
    return response.data;
  },

  async deleteTemplate(
    templateId: number,
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ): Promise<void> {
    const httpClient = options?.httpClient ?? defaultAxios;
    await httpClient.delete(
      `/api/application_form_questionnaire/templates/${templateId}/`,
      { signal: options?.signal },
    );
  },
};
