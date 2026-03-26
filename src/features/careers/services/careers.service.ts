import { defaultAxios } from "@/config/axios";
import type { PositionFormData } from "@/features/external_posting";
import type { PRFFormData } from "@/features/prf/types/prf.types";
import type { JobData } from "@/features/careers/types/job.types";

export type JobListingsResponse = JobData[];
export type JobDetailResponse = PRFFormData | PositionFormData;

export interface GetJobDetailParams {
  jobId: string;
}

export const careersService = {
  async getJobListingsResponse(): Promise<JobListingsResponse> {
    const response = await defaultAxios.get("/api/job/");
    return response.data;
  },

  async getJobDetailResponse(
    params: GetJobDetailParams,
  ): Promise<JobDetailResponse> {
    const response = await defaultAxios.get(`/api/job/${params.jobId}/`);
    return response.data;
  },
};
