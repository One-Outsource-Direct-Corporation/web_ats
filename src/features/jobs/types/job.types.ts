export interface JobPostingResponseDto {
  id: number;
  job_title: string;
  created_at?: string | null;
  updated_at?: string | null;
  type?: "client" | "prf" | null;
  client_name?: string | null;
  number_of_vacancies?: number | null;
  status?: string | null;
  department?: {
    name?: string | null;
  } | null;
  department_name?: string | null;
  employment_type?: string | null;
  total_candidates?: number | null;
}

export interface JobPostingListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingResponseDto[];
}

export interface JobListItem {
  id: string;
  title: string;
  created: string;
  postingType?: "client" | "prf";
  clientName?: string;
  totalCandidates?: number;
  vacancies?: number;
  status?: string;
  department?: string;
  employmentType?: string;
}

export type JobQueryResult = JobListItem[];
export type Job = JobListItem;

export interface JobPipelineStepResponseDto {
  id?: number;
  process_type: string;
  process_title?: string | null;
  stage: number;
  order: number;
}

export interface JobDetailPipelineOwnerDto {
  pipeline?: JobPipelineStepResponseDto[] | null;
}

export interface JobDetailResponseDto {
  id: number;
  job_title?: string;
  prf?: JobDetailPipelineOwnerDto | null;
  prf_nested?: JobDetailPipelineOwnerDto | null;
  external_posting?: JobDetailPipelineOwnerDto | null;
  external_posting_nested?: JobDetailPipelineOwnerDto | null;
  [key: string]: unknown;
}

export interface JobPipelineStep {
  id: string;
  process_type: string;
  process_title: string;
  stage: number;
  order: number;
}
