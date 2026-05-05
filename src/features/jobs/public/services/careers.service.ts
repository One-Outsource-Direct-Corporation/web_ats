import { defaultAxios } from "@/config/axios";
import type { JobData } from "@/features/jobs/public/types/job.types";
import type {
  CandidateApplicationSubmissionFiles,
  CandidateApplicationSubmissionPayload,
  CandidateApplicationSubmissionResponse,
  PublicApplyJobDetailResponse,
} from "@/features/jobs/public/types/jobApply.types";
import type { PublicJobDetailResponse } from "@/features/jobs/public/types/jobPublicDetail.types";

export type JobListingsResponse = JobData[];
export type JobDetailResponse = PublicApplyJobDetailResponse;

export interface GetJobDetailParams {
  jobId: string;
}

function buildCandidateApplicationFormData(
  payload: CandidateApplicationSubmissionPayload,
  files: CandidateApplicationSubmissionFiles,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  if (files.resume) {
    formData.append("resume", files.resume);
  }

  if (files.coverLetter) {
    formData.append("cover_letter", files.coverLetter);
  }

  if (files.photo) {
    formData.append("photo", files.photo);
  }

  if (files.medicalCertificate) {
    formData.append("medical_certificate", files.medicalCertificate);
  }

  return formData;
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

  async submitCandidateApplication(
    payload: CandidateApplicationSubmissionPayload,
    files: CandidateApplicationSubmissionFiles,
  ): Promise<CandidateApplicationSubmissionResponse> {
    const formData = buildCandidateApplicationFormData(payload, files);
    const response = await defaultAxios.post("/api/candidate/apply/", formData);
    return response.data;
  },

};
