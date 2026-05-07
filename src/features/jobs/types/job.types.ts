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
  interviewer?: {
    id: number;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  candidate_application_ids?: number[] | null;
  candidate_applications?: JobPipelineCandidateResponseDto[] | null;
  assessments?: AssessmentResponseDto[] | null;
}

export interface AssessmentFileResponseDto {
  id: number;
  filename?: string | null;
  file?: string | null;
  file_extension?: string | null;
}

export interface AssessmentResponseDto {
  id: number;
  type_label?: string | null;
  type?: string | null;
  order?: number;
  is_required?: boolean;
  is_active?: boolean;
  file?: AssessmentFileResponseDto | null;
}

export interface JobPipelineCandidateResponseDto {
  id: number;
  name: string;
  status: string;
  status_label: string;
  pipeline_step_id?: number | null;
  pipeline_status?: string | null;
  pipeline_status_label?: string | null;
  scheduled_for?: string | null;
  assigned_interviewer_name?: string | null;
  assigned_interviewer_email?: string | null;
  department?: string | null;
  photo_url?: string | null;
  resume_url?: string | null;
}

export interface JobPipelineCandidate {
  id: number;
  name: string;
  status: string;
  statusLabel: string;
  pipelineStepId?: number;
  pipelineStatus?: string;
  pipelineStatusLabel?: string;
  scheduledFor?: string;
  assignedInterviewerName?: string;
  assignedInterviewerEmail?: string;
  department?: string;
  photoUrl?: string;
  resumeUrl?: string;
}

export interface JobDetailPipelineOwnerDto {
  pipeline?: JobPipelineStepResponseDto[] | null;
}

export interface JobDetailResponseDto {
  id: number;
  job_title?: string;
  work_schedule_from?: string;
  work_schedule_to?: string;
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
  interviewerName?: string;
  interviewerEmail?: string;
  interviewerId?: number;
  candidateApplicationIds: number[];
  candidateApplications: JobPipelineCandidate[];
  assessments: PipelineAssessment[];
}

export interface PipelineAssessment {
  id: number;
  type_label?: string | null;
  type?: string | null;
  file?: {
    id?: number;
    filename?: string | null;
    file?: string | null;
    file_extension?: string | null;
  } | null;
}
