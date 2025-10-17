export interface AssessmentTypes {
  technical: boolean;
  language: boolean;
  cognitive: boolean;
  personality: boolean;
  behavioral: boolean;
  cultural: boolean;
}

export interface HardwareRequired {
  desktop: boolean;
  handset: boolean;
  headset: boolean;
  laptop: boolean;
}

export interface SoftwareRequired {
  [key: string]: boolean;
}

export interface PRF {
  job_title: string;
  target_start_date: string;
  number_of_vacancies: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  business_unit: string;
  department: string;
  department_display: string;
  interview_levels: number;
  immediate_supervisor: string | null;
  immediate_supervisor_display: string | null;
  hiring_managers: string[];
  employment_type: string;
  work_setup: string;
  category: string;
  position: string;
  working_site: string;
  work_schedule_from: string;
  work_schedule_to: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  non_negotiables: string;
  salary_budget: string;
  is_salary_range: boolean;
  min_salary: string;
  max_salary: string;
  assessment_required: boolean;
  assessment_types: AssessmentTypes;
  other_assessment: string;
  hardware_required: HardwareRequired;
  software_required: SoftwareRequired;
}

export interface PRFResponse {
  id: number;
  // job_posting: JobPostingResponse;
  number_of_vacancies: number;
  business_unit: string;
  interview_levels: number;
  category: string;
  position: string;
  work_schedule_from: string;
  work_schedule_to: string;
  non_negotiables: string;
  salary_budget: string;
  is_salary_range: boolean;
  assessment_required: boolean;
  other_assessment: string[];
  immediate_supervisor: number | null;
  immediate_supervisor_display: string | null;
  hiring_managers: number[];
  assessment_types: {
    id: number;
    name: string;
  }[];
  hardware_requirements: {
    id: number;
    name: string;
  }[];
  software_requirements: {
    id: number;
    name: string;
  }[];
}

export type FormDataType = PRF;
