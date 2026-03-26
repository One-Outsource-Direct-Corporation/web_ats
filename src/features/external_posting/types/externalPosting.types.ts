import type { ApplicationFormData } from "@/shared/types/application_form.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";
import type { User } from "@/features/auth/types/auth.types";
import type { BatchEntry } from "@/features/batch/types/batch.types";
import type { LocationEntry } from "@/features/location/types/location.types";
export type {
  Client,
  ClientBase,
  ClientResponse,
  CreateClientPayload,
} from "@/features/client/types/client.types";

export interface StepProps {
  number: number;
  title: string;
  active: boolean;
}

export interface JobPosting {
  job_title: string | null;
  experience_level: string | null;
  department_name: string | null;
  department_name_other: string | null;
  employment_type: string | null;
  number_of_vacancies: number | null;
  work_setup: string | null;
  target_start_date: string | null;
  reason_for_posting: string | null;
  other_reason_for_posting: string | null;
  min_salary: number | null;
  max_salary: number | null;
  description: string | null;
  responsibilities: string | null;
  qualifications: string | null;
  working_site: string | null;
  work_schedule_from: string | null;
  work_schedule_to: string | null;
  approving_manager?: ApproverDb[];
}

export interface JobPostingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingDb[] | [];
}

export type JobPostingResponse = JobPostingDb;

export interface GetPositionsParams {
  my_postings?: boolean;
  page?: number;
  type?: string;
  status?: string;
  employment_type?: string;
  work_setup?: string;
  order_by?: string;
  published?: string;
  no_active?: boolean;
  exclude_draft?: boolean;
}

export interface ApproverDb {
  id: number;
  approving_manager: User;
  comment: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalStatusDb {
  approved_count: number;
  is_fully_approved: boolean;
  required_count: number;
}

export interface JobPostingDb extends JobPosting {
  id: number;
  status: string;
  posted_by_display: User;
  type: "client" | "prf";
  type_display: "Client" | "PRF";
  target_start_date: string;
  active: boolean;
  published: boolean;
  posted_by: number;
  created_at: string;
  updated_at: string;
}

export interface JobPostingDbWithApprovers extends JobPostingDb {
  approving_managers: ApproverDb[];
}

export interface PositionBase {
  client: number | null;
  education_level: string | null;
}

export interface Position extends PositionBase {
  job_posting: JobPosting;
  application_form: ApplicationFormData;
  pipeline: PipelineStep[] | [];
  locations: LocationEntry[] | [];
  batches: BatchEntry[] | [];
}

export type ExternalPosting = Position;

export type PositionResponse = PositionDb;
export type CreatePositionPayload = Position;
export type UpdatePositionPayload = Partial<Position>;

export interface PositionDb extends Omit<Position, "job_posting"> {
  id: number;
  job_posting: JobPostingDb;
  client_display: string;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "client";
  status: string;
  published: boolean;
  active: boolean;
}

export type PositionFormData = Position | PositionDb;
export type ExternalPostingFormData = PositionFormData;
