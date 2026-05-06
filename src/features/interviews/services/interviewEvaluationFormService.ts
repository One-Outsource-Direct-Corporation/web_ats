import type { AxiosInstance } from "axios";

import { axiosPrivate } from "@/config/axios";

export interface InterviewEvaluationFormTemplate {
  id: number;
  name: string;
  description?: string | null;
  sections?: unknown;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InterviewEvaluationFormPayload {
  candidate_application: number;
  candidate_pipeline_step?: number | null;
  template?: number | null;
  interviewer?: number | null;
  scheduled_for: string;
  data: Record<string, unknown>;
  ai_summary?: string;
  interviewer_notes?: string;
}

export interface InterviewEvaluationFormDataSectionRow {
  id?: string;
  skill?: string;
  rating?: string | number;
  remarks?: string;
}

export interface InterviewEvaluationFormDataSection {
  key?: string;
  title?: string;
  description?: string;
  rows?: InterviewEvaluationFormDataSectionRow[];
}

export interface InterviewEvaluationFormRecord {
  id: number;
  candidate_application: number;
  candidate_pipeline_step?: number | null;
  template?: number | null;
  interviewer?: number | null;
  scheduled_for?: string | null;
  data?: {
    sections?: InterviewEvaluationFormDataSection[];
    applicant_name?: string;
    interview_date?: string;
    position_applying_for?: string;
    interviewer?: string;
  };
  ai_summary?: string | null;
  interviewer_notes?: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CandidatePipelineProgressRequest {
  candidate_application_id: number;
  pipeline_step_id: number;
  outcome: "pass" | "fail";
  remarks?: string;
}

export interface CandidatePipelineProgressResponse {
  candidate_application_id: number;
  previous_pipeline_step_id: number | null;
  previous_status: string | null;
  previous_status_label: string | null;
  outcome: string;
  current_pipeline_step_id: number | null;
  current_pipeline_process_type: string | null;
  current_status: string;
  current_status_label: string;
  message: string;
}

const unwrapResults = <T,>(responseData: T[] | { results?: T[] } | undefined): T[] => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  return responseData?.results ?? [];
};

const unwrapSingleOrList = <T,>(responseData: T[] | T | { results?: T[] } | null | undefined): T[] => {
  // Handle null/undefined
  if (responseData === null || responseData === undefined) {
    return [];
  }

  // Handle array (backward compatibility)
  if (Array.isArray(responseData)) {
    return responseData;
  }

  // Handle paginated response with results
  if (typeof responseData === "object" && "results" in responseData) {
    return responseData.results ?? [];
  }

  // Handle single object - wrap in array for consistent return type
  return [responseData as T];
};

export const interviewEvaluationFormService = {
  async listTemplates(options?: { httpClient?: AxiosInstance; signal?: AbortSignal }) {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const response = await httpClient.get("/api/candidate/ief/templates/", {
      signal: options?.signal,
    });

    return unwrapResults<InterviewEvaluationFormTemplate>(response.data);
  },

  async createForm(
    payload: InterviewEvaluationFormPayload,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const response = await httpClient.post("/api/candidate/ief/", payload);

    return response.data;
  },

  async listForms(
    params: { candidateId: number; pipelineStepId?: number },
    options?: { httpClient?: AxiosInstance; signal?: AbortSignal },
  ) {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const query = new URLSearchParams();
    query.set("candidate_id", String(params.candidateId));
    if (params.pipelineStepId) {
      query.set("pipeline_step_id", String(params.pipelineStepId));
    }

    const response = await httpClient.get(`/api/candidate/ief/?${query.toString()}`, {
      signal: options?.signal,
    });

    return unwrapSingleOrList<InterviewEvaluationFormRecord>(response.data);
  },

  async progressCandidate(
    payload: CandidatePipelineProgressRequest,
    options?: { httpClient?: AxiosInstance },
  ) {
    const httpClient = options?.httpClient ?? axiosPrivate;
    const response = await httpClient.post<CandidatePipelineProgressResponse>(
      "/api/candidate/pipeline/progress/",
      payload,
    );

    return response.data;
  },
};
