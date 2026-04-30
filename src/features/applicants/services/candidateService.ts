import { defaultAxios } from "@/config/axios";

interface ShortlistActionResponse {
  candidate_application_id: number;
  pipeline_step_id: number;
  previous_status: string;
  new_status: string;
  message: string;
}

interface ShortlistApproveResponse {
  candidate_application_id: number;
  previous_pipeline_step_id: number | null;
  previous_status: string | null;
  previous_status_label: string | null;
  current_pipeline_step_id: number | null;
  current_pipeline_process_type: string | null;
  current_status: string;
  current_status_label: string;
  message: string;
}

export const candidateService = {
  async markAsShortlisted(
    candidateApplicationId: number,
    pipelineStepId: number,
    remarks?: string,
  ): Promise<ShortlistActionResponse> {
    const response = await defaultAxios.post(
      "/api/candidate/pipeline/shortlist/",
      {
        candidate_application_id: candidateApplicationId,
        pipeline_step_id: pipelineStepId,
        remarks: remarks || "",
      },
    );
    return response.data;
  },

  async approveShortlist(
    candidateApplicationId: number,
    pipelineStepId: number,
    remarks?: string,
  ): Promise<ShortlistApproveResponse> {
    const response = await defaultAxios.post(
      "/api/candidate/pipeline/shortlist/approve/",
      {
        candidate_application_id: candidateApplicationId,
        pipeline_step_id: pipelineStepId,
        remarks: remarks || "",
      },
    );
    return response.data;
  },

  async rejectShortlist(
    candidateApplicationId: number,
    pipelineStepId: number,
    remarks?: string,
  ): Promise<ShortlistActionResponse> {
    const response = await defaultAxios.post(
      "/api/candidate/pipeline/shortlist/reject/",
      {
        candidate_application_id: candidateApplicationId,
        pipeline_step_id: pipelineStepId,
        remarks: remarks || "",
      },
    );
    return response.data;
  },
};
