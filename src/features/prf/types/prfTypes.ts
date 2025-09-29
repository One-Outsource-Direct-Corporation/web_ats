// PRF feature types
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

export interface FormData {
  job_title: string;
  target_start_date: string;
  number_of_vacancies: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  business_unit: string;
  department_name: string;
  interview_levels: number;
  immediate_supervisor: string;
  hiring_managers: string[];
  contract_type: string;
  work_arrangement: string;
  category: string;
  position: string;
  working_site: string;
  work_schedule_from: string;
  work_schedule_to: string;
  job_description: string;
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

export type FormDataType = FormData;

export type PRFResponse = FormDataType & {
  id: number;
};
