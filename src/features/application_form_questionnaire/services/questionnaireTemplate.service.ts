import type { AxiosInstance } from "axios";

import { defaultAxios } from "@/config/axios";
import type {
  QuestionnaireTemplateListParams,
  QuestionnaireTemplateListResponse,
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
};
