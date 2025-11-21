import type {
  JobPosting,
  JobPostingDb,
} from "@/features/positions-client/types/create_position.types";
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
  category: string | null;
  work_schedule_from: string | null;
  work_schedule_to: string | null;
  hardware_required: HardwareRequired | {};
  software_required: SoftwareRequired | {};
}

export interface PRF extends PRFBase {
  job_posting: JobPosting;
  application_form: ApplicationFormData;
  pipeline: PipelineStep[] | [];
}

export interface PRFDb extends Omit<PRF, "job_posting"> {
  id: number;
  job_posting: JobPostingDb;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "prf";
  status: string;
  published: boolean;
  active: boolean;
}

export type PRFFormData = PRF | PRFDb;
