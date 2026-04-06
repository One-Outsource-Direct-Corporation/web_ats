import { defaultAxios } from "@/config/axios";
import type { JobData } from "@/features/jobs/public/types/job.types";
import type { PublicApplyJobDetailResponse } from "@/features/jobs/public/types/jobApply.types";
import type { PublicJobDetailResponse } from "@/features/jobs/public/types/jobPublicDetail.types";

export type JobListingsResponse = JobData[];
export type JobDetailResponse = PublicApplyJobDetailResponse;

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
    const response = await defaultAxios.get(`/api/job/${params.jobId}/apply/`);
    return response.data;
  },

  async getJobPublicDetailResponse(
    params: GetJobDetailParams,
  ): Promise<PublicJobDetailResponse> {
    const response = await defaultAxios.get(`/api/job/${params.jobId}/public/`);
    return response.data;
  },
};
