import type { JobPosting } from "@/features/positions-client/types/create_position.types";
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

// export interface PRF {
//   job_title: string;
//   target_start_date: string;
//   number_of_vacancies: string;
//   reason_for_posting: string;
//   other_reason_for_posting: string;
//   business_unit: string;
//   department: string;
//   department_display: string;
//   // interview_levels: number;
//   immediate_supervisor: string | null;
//   immediate_supervisor_display: string | null;
//   // hiring_managers: string[];
//   employment_type: string;
//   work_setup: string;
//   category: string;
//   position: string;
//   working_site: string;
//   work_schedule_from: string;
//   work_schedule_to: string;
//   description: string;
//   responsibilities: string;
//   qualifications: string;
//   non_negotiables: string;
//   salary_budget: string;
//   is_salary_range: boolean;
//   min_salary: string;
//   max_salary: string;
//   assessment_required: boolean;
//   assessment_types: AssessmentTypes;
//   other_assessment: string;
//   hardware_required: HardwareRequired;
//   software_required: SoftwareRequired;
// }

// export interface PRFResponse {
//   id: number;
//   // job_posting: JobPostingResponse;
//   number_of_vacancies: number;
//   business_unit: string;
//   interview_levels: number;
//   category: string;
//   position: string;
//   work_schedule_from: string;
//   work_schedule_to: string;
//   non_negotiables: string;
//   salary_budget: string;
//   is_salary_range: boolean;
//   assessment_required: boolean;
//   other_assessment: string[];
//   immediate_supervisor: number | null;
//   immediate_supervisor_display: string | null;
//   hiring_managers: number[];
//   assessment_types: {
//     id: number;
//     name: string;
//   }[];
//   hardware_requirements: {
//     id: number;
//     name: string;
//   }[];
//   software_requirements: {
//     id: number;
//     name: string;
//   }[];
//   hiring_managers_display: PRFHiringManagerResponse[];
// }

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

export interface PRFDb extends PRF {
  id: number;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "prf";
  status: string;
  published: boolean;
  active: boolean;
}

export type PRFFormData = PRF | PRFDb;
