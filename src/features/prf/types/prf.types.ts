import type { User } from "@/features/auth/types/auth.types";
import type {
  ApprovalStatusDb,
  ApproverDb,
  JobPosting,
  JobPostingDb,
} from "@/features/external_posting";
import type { ApplicationFormData } from "@/shared/types/application_form.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";

export interface HardwareRequired {
  [key: string]: boolean;
}

export interface SoftwareRequired {
  [key: string]: boolean;
}

export interface PRFHiringManagerResponse {
  id: number;
  name: string;
}

export interface PRFBase {
  business_unit: string | null;
  immediate_supervisor: number | null;
  immediate_supervisor_display: User | null;
  category: string | null;
  hardware_required: HardwareRequired;
  software_required: SoftwareRequired;
}

export interface PRF extends PRFBase {
  job_posting: JobPosting;
  application_form: ApplicationFormData;
  pipeline: PipelineStep[] | [];
}

export type PRFResponse = PRFDb;
export type PrfResponse = PRFResponse;
export type CreatePrfPayload = PRF;
export type UpdatePrfPayload = Partial<PRF>;

export interface PRFDb extends Omit<PRF, "job_posting"> {
  id: number;
  job_posting: JobPostingDb;
  immediate_supervisor_display: User | null;
  approving_managers: ApproverDb[];
  approval_status: ApprovalStatusDb;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "prf";
  status: string;
  published: boolean;
  active: boolean;
}

export type PRFFormData = PRF | PRFDb;
